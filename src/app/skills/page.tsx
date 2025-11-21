import { Metadata } from 'next'
import React from 'react'
import { FaAngular, FaReact, FaNodeJs, FaDocker, FaAws } from 'react-icons/fa'
import { SiTypescript, SiSharp, SiDotnet, SiPostgresql, SiMongodb } from 'react-icons/si'
import { personalInfo, skills } from '@/lib/data'

export const metadata: Metadata = {
  title: `Skills & Technologies | ${personalInfo.name}`,
  description: 'Technical skills including Angular, React, C#, .NET, and modern development tools',
}

export default function Skills() {
  const getIcon = (skillName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Angular': <FaAngular className="text-red-600 dark:text-red-500" />,
      'React': <FaReact className="text-blue-500 dark:text-blue-400" />,
      'TypeScript': <SiTypescript className="text-blue-600 dark:text-blue-400" />,
      'C#': <SiSharp className="text-purple-600 dark:text-purple-400" />,
      '.NET Core': <SiDotnet className="text-purple-700 dark:text-purple-400" />,
      'Node.js': <FaNodeJs className="text-green-600 dark:text-green-500" />,
      'SQL Server': <SiPostgresql className="text-blue-700 dark:text-blue-400" />,
      'PostgreSQL': <SiPostgresql className="text-blue-600 dark:text-blue-400" />,
      'MongoDB': <SiMongodb className="text-green-600 dark:text-green-500" />,
      'Docker': <FaDocker className="text-blue-500 dark:text-blue-400" />,
      'AWS': <FaAws className="text-orange-500 dark:text-orange-400" />,
    }
    return iconMap[skillName] || null
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-4 text-foreground">Skills & Technologies</h1>
      <p className="text-xl text-muted-foreground mb-12">
        A comprehensive overview of my technical expertise
      </p>

      <div className="space-y-12">
        {skills.map((category, index) => (
          <div key={index}>
            <h2 className="text-3xl font-bold mb-6 text-foreground">{category.category}</h2>
            <div className="grid gap-6">
              {category.skills.map((skill, i) => (
                <div key={i} className="border border-border p-6 rounded-lg shadow bg-card transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getIcon(skill.name) && <span className="text-3xl">{getIcon(skill.name)}</span>}
                      <div>
                        <h3 className="text-xl font-semibold text-card-foreground">{skill.name}</h3>
                        <span className="text-sm text-muted-foreground">{skill.years}</span>
                      </div>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold transition-colors">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 transition-colors">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
