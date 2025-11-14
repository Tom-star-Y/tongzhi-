"use client"
import { createContext, useContext, useMemo, useState } from "react"

export type Template = {
  id: string
  name: string
  type: "email" | "teams" | "webhook"
  subject?: string
  body: string
  format: "html" | "plain" | "json"
}

type TemplatesContextValue = {
  templates: Template[]
  addTemplate: (tpl: Template) => void
  removeTemplate: (id: string) => void
  updateTemplate: (tpl: Template) => void
}

const TemplatesContext = createContext<TemplatesContextValue | null>(null)

export function TemplatesProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "默认邮件模板",
      type: "email",
      subject: "【告警】{rule_name} 触发",
      body: `您好，\n\n规则 "{rule_name}" 在 {window_start} 至 {window_end} 期间触发了告警。\n\n触发次数: {count}\n严重程度: {severity}\n\n示例通话ID:\n{call_links}\n\n请及时查看并处理。\n\n---\n此邮件由系统自动发送，请勿回复。`,
      format: "plain",
    },
    {
      id: "2",
      name: "Teams 卡片模板",
      type: "teams",
      body: `{"@type":"MessageCard","@context":"https://schema.org/extensions","summary":"告警通知","themeColor":"FF0000","title":"告警: {rule_name}","sections":[{"activityTitle":"规则触发详情","facts":[{"name":"时间窗口","value":"{window_start} ~ {window_end}"},{"name":"触发次数","value":"{count}"},{"name":"严重程度","value":"{severity}"}]}],"potentialAction":[{"@type":"OpenUri","name":"查看详情","targets":[{"os":"default","uri":"{dashboard_link}"}]}]}`,
      format: "json",
    },
  ])

  const value = useMemo(
    () => ({
      templates,
      addTemplate: (tpl: Template) => setTemplates((prev) => [...prev, tpl]),
      removeTemplate: (id: string) => setTemplates((prev) => prev.filter((t) => t.id !== id)),
      updateTemplate: (tpl: Template) =>
        setTemplates((prev) => prev.map((t) => (t.id === tpl.id ? tpl : t))),
    }),
    [templates]
  )

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>
}

export function useTemplates() {
  const ctx = useContext(TemplatesContext)
  if (!ctx) throw new Error("useTemplates must be used within TemplatesProvider")
  return ctx
}

