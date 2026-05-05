/**
 * System-prompt composer for the LlmChat widget.
 *
 * Pulls from three knowledge sources, each with a defined role:
 *   - data.ts        → canonical site content (experience, skills, projects)
 *   - linkedin.ts    → LinkedIn-only facts (summary, languages, certs, top skills)
 *   - faqs.ts        → curated Q&A pairs that teach the model "Davit's voice"
 *
 * The output goes into the chat widget as `systemPrompt`, prepended as a
 * `system` message on every request to Ollama. Aim for under ~10 KB; the
 * model's context budget is 32 K tokens but trimmer prompts mean lower
 * latency and more room for the user's conversation.
 */

import { personalInfo, experiences, skills, projects } from './data'
import { linkedin } from './linkedin'
import { faqs } from './faqs'

/** Build the full system prompt. Pure function; safe to call at render time. */
export function buildCvSystemPrompt(): string {
    const sections: string[] = []

    // -- 1. Identity + ground rules ----------------------------------------
    sections.push(
        `You are an AI assistant on ${personalInfo.name}'s personal CV site (https://davit.yedigaryan.pro).
Answer questions about him in third person, factually, grounded ONLY in
the information below. If a question can't be answered from this data,
say so honestly — never invent employers, dates, technologies, or
opinions. Code-switch into Armenian or Russian if the user does.`,
    )

    // -- 2. About / summary -----------------------------------------------
    const aliasLines = personalInfo.nameAliases
        .map((a) => `- ${a.language}: ${a.spelling}`)
        .join('\n')

    sections.push(`# About
${personalInfo.shortBio}

## Name across languages
The same person, written differently depending on script and language.
Treat any of the spellings below as referring to ${personalInfo.name};
when the user uses one of them, mirror their spelling in the reply.
${aliasLines}

## Long-form summary (LinkedIn)
${linkedin.summary}

## Top skills (LinkedIn-pinned)
${linkedin.topSkills.map((s) => `- ${s}`).join('\n')}`)

    // -- 3. Contact + location --------------------------------------------
    sections.push(`# Contact
- Email: ${personalInfo.email}
- LinkedIn: ${personalInfo.linkedin}
- GitHub: ${personalInfo.github}
- Location (current): ${personalInfo.location} (${personalInfo.locationNote})
- Geographic area on LinkedIn: ${linkedin.geographicArea}`)

    // -- 4. Languages -----------------------------------------------------
    sections.push(`# Languages
${linkedin.languages.map((l) => `- ${l.name} — ${l.proficiency}`).join('\n')}`)

    // -- 5. Experience (data.ts is canonical; linkedin adds extras) -------
    const dataExp = experiences
        .map((e) => {
            const head = `${e.period} · ${e.role} @ ${e.company}${e.location ? ` (${e.location})` : ''}`
            const ach = e.achievements.length
                ? '\n  - ' + e.achievements.join('\n  - ')
                : ''
            const tech = e.technologies.length
                ? `\n  Tech: ${e.technologies.join(', ')}`
                : ''
            return `* ${head}\n  ${e.description}${ach}${tech}`
        })
        .join('\n\n')

    const extraExp = linkedin.extraExperience
        .map(
            (e) =>
                `* ${e.period} · ${e.role} @ ${e.company}${e.location ? ` (${e.location})` : ''}\n  ${e.summary}${e.skills?.length ? `\n  Skills: ${e.skills.join(', ')}` : ''}`,
        )
        .join('\n\n')

    sections.push(`# Experience
${dataExp}

## Additional experience (from LinkedIn — supplements the above)
${extraExp}`)

    // -- 6. Skills (tiered, from data.ts) ---------------------------------
    const sk = skills
        .map(
            (cat) =>
                `## ${cat.category}\n${cat.skills
                    .map(
                        (s) =>
                            `- ${s.name} — ${s.level} (${s.years})${s.note ? ` — ${s.note}` : ''}`,
                    )
                    .join('\n')}`,
        )
        .join('\n\n')

    sections.push(`# Skills
${sk}`)

    // -- 7. Projects ------------------------------------------------------
    const pr = projects
        .map(
            (p) =>
                `* ${p.title} — ${p.description}\n  Tech: ${p.technologies.join(', ')}${p.highlights.length ? `\n  Highlights: ${p.highlights.join('; ')}` : ''}`,
        )
        .join('\n\n')

    sections.push(`# Projects
${pr}`)

    // -- 8. Education + certifications ------------------------------------
    sections.push(`# Education
${linkedin.education.map((e) => `- ${e.period} · ${e.degree} in ${e.field} — ${e.institution}`).join('\n')}

# Certifications
${linkedin.certifications.map((c) => `- ${c.name}${c.issuer ? ` (${c.issuer})` : ''}${c.detail ? ` — ${c.detail}` : ''}`).join('\n')}`)

    // -- 9. Curated FAQs (voice training) ---------------------------------
    if (faqs.length > 0) {
        const faqSection = faqs
            .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
            .join('\n\n')

        sections.push(`# How Davit would answer common questions
Use these as templates for tone and content. Paraphrase naturally —
don't quote them verbatim — but stay faithful to the substance.

${faqSection}`)
    }

    // -- 10. Final guardrails ---------------------------------------------
    sections.push(`# Style
- Concise. Most answers fit in 1-3 sentences.
- Friendly, technically precise. No marketing fluff.
- Use light Markdown when it improves clarity: bullet lists, **bold**
  for emphasis, \`inline code\` for tech names, fenced \`\`\`code\`\`\`
  blocks for snippets. Don't over-format short replies.
- Never invent employers, dates, salaries, or salaries-of-others.
- For anything you genuinely don't know, say:
  "I don't have that in Davit's CV — best to email him at ${personalInfo.email}."`)

    return sections.join('\n\n---\n\n')
}

/**
 * Diagnostic helper — useful in the browser console:
 *   import('./lib/system-prompt').then(m => console.log(m.systemPromptStats()))
 */
export function systemPromptStats() {
    const prompt = buildCvSystemPrompt()
    return {
        chars: prompt.length,
        // Rough token estimate — Gemma's tokenizer averages ~4 chars/token
        // for English. Accurate enough for budget planning.
        approxTokens: Math.ceil(prompt.length / 4),
        sections: prompt.split('\n\n---\n\n').length,
    }
}
