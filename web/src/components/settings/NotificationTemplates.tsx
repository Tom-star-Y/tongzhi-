import { useState } from "react";
import { Plus, Eye, Code } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { toast } from "@/lib/toast";
import { useTemplates, type Template } from "@/lib/templates-store";

interface Template {
  id: string;
  name: string;
  type: "email" | "teams" | "webhook";
  subject?: string;
  body: string;
  format: "html" | "plain" | "json";
}

export function NotificationTemplates() {
  const { templates, addTemplate } = useTemplates()

  const [editingTemplate, setEditingTemplate] = useState<Partial<Template>>({
    type: "email",
    format: "plain",
    body: ""
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleCreateTemplate = () => {
    if (!editingTemplate.name || !editingTemplate.body) {
      toast.error("请填写模板名称和内容");
      return;
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: editingTemplate.name,
      type: editingTemplate.type || "email",
      subject: editingTemplate.subject,
      body: editingTemplate.body,
      format: editingTemplate.format || "plain"
    };

    addTemplate(newTemplate);
    setEditingTemplate({ type: "email", format: "plain", body: "" });
    toast.success("模板创建成功");
  };

  const renderPreview = () => {
    const sampleData = {
      rule_name: "高频支付失败",
      window_start: "2025-11-14 14:00:00",
      window_end: "2025-11-14 14:30:00",
      count: "8",
      severity: "critical",
      call_links: "- call_001\n- call_002\n- call_003",
      dashboard_link: "https://dashboard.example.com/alerts/123"
    };

    let preview = editingTemplate.body || "";
    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replaceAll(`{${key}}`, value);
    });

    return preview;
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="create" className="w-full flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="create">创建模板</TabsTrigger>
          <TabsTrigger value="list">模板列表</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="templateName">模板名称 *</Label>
                <Input
                  id="templateName"
                  placeholder="例如：默认邮件模板"
                  value={editingTemplate.name || ""}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="templateType">通知类型</Label>
                  <Select
                    value={editingTemplate.type}
                    onValueChange={(value: any) => setEditingTemplate({ ...editingTemplate, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">邮箱 (Email)</SelectItem>
                      <SelectItem value="teams">Teams</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="templateFormat">格式</Label>
                  <Select
                    value={editingTemplate.format}
                    onValueChange={(value: any) => setEditingTemplate({ ...editingTemplate, format: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plain">纯文本 (Plain)</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {editingTemplate.type === "email" && (
                <div>
                  <Label htmlFor="subject">邮件主题</Label>
                  <Input
                    id="subject"
                    placeholder="例如：【告警】{rule_name} 触发"
                    value={editingTemplate.subject || ""}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="body">模板内容 *</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? <Code className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {previewMode ? "编辑" : "预览"}
                  </Button>
                </div>
                {!previewMode ? (
                  <Textarea
                    id="body"
                    rows={15}
                    placeholder="输入模板内容..."
                    value={editingTemplate.body || ""}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                    className="font-mono text-sm"
                  />
                ) : (
                  <div className="border rounded-lg p-4 bg-gray-50 min-h-[360px] font-mono text-sm whitespace-pre-wrap">
                    {renderPreview()}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="mb-2">可用变量</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <code>{"{rule_name}"}</code>
                  <span className="text-gray-600">规则名称</span>
                  <code>{"{window_start}"}</code>
                  <span className="text-gray-600">窗口开始时间</span>
                  <code>{"{window_end}"}</code>
                  <span className="text-gray-600">窗口结束时间</span>
                  <code>{"{count}"}</code>
                  <span className="text-gray-600">各字段</span>
                  <code>{"{window_end}"}</code>
                  <span className="text-gray-600">通话记录</span>
                  <code>{"{count}"}</code>
                  <span className="text-gray-600">触发次数</span>
                  <code>{"{severity}"}</code>
                  <span className="text-gray-600">严重程度</span>
                  <code>{"{examples}"}</code>
                  <span className="text-gray-600">示例标签</span>
                  <code>{"{call_links}"}</code>
                  <span className="text-gray-600">关联通话链接</span>
                  <code>{"{dashboard_link}"}</code>
                  <span className="text-gray-600">控制台链接</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditingTemplate({ type: "email", format: "plain", body: "" })}>
              重置
            </Button>
            <Button onClick={handleCreateTemplate} className="bg-green-600 hover:bg-green-700">
              创建模板
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="mb-2">{template.name}</h4>
                    <div className="flex gap-2">
                      <Badge variant="outline">{template.type}</Badge>
                      <Badge variant="outline">{template.format}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    编辑
                  </Button>
                </div>
                {template.subject && (
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">主题: </span>
                    <span className="text-sm font-mono">{template.subject}</span>
                  </div>
                )}
                <div className="bg-gray-50 rounded p-3 font-mono text-xs overflow-auto max-h-40">
                  {template.body}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
