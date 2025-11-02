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
      'Angular': <FaAngular className="text-red-600" />,
      'React': <FaReact className="text-blue-500" />,
      'TypeScript': <SiTypescript className="text-blue-600" />,
      'C#': <SiSharp className="text-purple-600" />,
      '.NET Core': <SiDotnet className="text-purple-700" />,
      'Node.js': <FaNodeJs className="text-green-600" />,
      'SQL Server': <SiPostgresql className="text-blue-700" />,
      'PostgreSQL': <SiPostgresql className="text-blue-600" />,
      'MongoDB': <SiMongodb className="text-green-600" />,
      'Docker': <FaDocker className="text-blue-500" />,
      'AWS': <FaAws className="text-orange-500" />,
    }
    return iconMap[skillName] || null
  }

  return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-4">Skills & Technologies</h1>
        <p className="text-xl text-gray-600 mb-12">
          A comprehensive overview of my technical expertise
        </p>

        <div className="space-y-12">
          {skills.map((category, index) => (
              <div key={index}>
                <h2 className="text-3xl font-bold mb-6">{category.category}</h2>
                <div className="grid gap-6">
                  {category.skills.map((skill, i) => (
                      <div key={i} className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {getIcon(skill.name) && <span className="text-3xl">{getIcon(skill.name)}</span>}
                            <div>
                              <h3 className="text-xl font-semibold">{skill.name}</h3>
                              <span className="text-sm text-gray-500">{skill.years}</span>
                            </div>
                          </div>
                          <span className="text-blue-600 font-semibold">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
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
