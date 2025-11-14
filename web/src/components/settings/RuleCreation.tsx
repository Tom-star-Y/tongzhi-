import { useState } from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "@/lib/toast";
import { useTemplates } from "@/lib/templates-store";

interface Rule {
  id: string;
  name: string;
  tagKey: string;
  tagType: "text" | "time" | "number" | "enum" | "boolean";
  operator: string;
  values: string[];
  windowMinutes: number;
  threshold: number;
  cooldownSeconds: number;
  enabled: boolean;
  severity: "info" | "warning" | "critical";
  notifications: Notification[];
}

interface Notification {
  type: "email" | "teams" | "webhook";
  target: string;
  templateId?: string;
}

export function RuleCreation() {
  const { templates } = useTemplates()
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      name: "高频支付失败",
      tagKey: "支付结果",
      tagType: "enum",
      operator: "IN",
      values: ["503", "网关超时"],
      windowMinutes: 30,
      threshold: 5,
      cooldownSeconds: 1200,
      enabled: true,
      severity: "critical",
      notifications: [
        { type: "email", target: "ops@company.com" },
        { type: "teams", target: "https://..." }
      ]
    }
  ]);

  const [editingRule, setEditingRule] = useState<Partial<Rule>>({
    tagType: "enum",
    operator: "IN",
    values: [],
    windowMinutes: 30,
    threshold: 5,
    cooldownSeconds: 1200,
    enabled: true,
    severity: "warning",
    notifications: []
  });

  const handleCreateRule = () => {
    if (!editingRule.name || !editingRule.tagKey) {
      toast.error("请填写规则名称和触发标签");
      return;
    }

    const newRule: Rule = {
      id: Date.now().toString(),
      name: editingRule.name,
      tagKey: editingRule.tagKey,
      tagType: editingRule.tagType || "enum",
      operator: editingRule.operator || "IN",
      values: editingRule.values || [],
      windowMinutes: editingRule.windowMinutes || 30,
      threshold: editingRule.threshold || 5,
      cooldownSeconds: editingRule.cooldownSeconds || 1200,
      enabled: editingRule.enabled ?? true,
      severity: editingRule.severity || "warning",
      notifications: editingRule.notifications || []
    };

    setRules([...rules, newRule]);
    setEditingRule({
      tagType: "enum",
      operator: "IN",
      values: [],
      windowMinutes: 30,
      threshold: 5,
      cooldownSeconds: 1200,
      enabled: true,
      severity: "warning",
      notifications: []
    });
    toast.success("规则创建成功");
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    toast.success("规则已删除");
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const addNotificationChannel = () => {
    setEditingRule({
      ...editingRule,
      notifications: [
        ...(editingRule.notifications || []),
        { type: "email", target: "", templateId: undefined }
      ]
    });
  };

  const removeNotificationChannel = (index: number) => {
    const newNotifications = [...(editingRule.notifications || [])];
    newNotifications.splice(index, 1);
    setEditingRule({ ...editingRule, notifications: newNotifications });
  };

  const updateNotificationChannel = (index: number, field: "type" | "target", value: string) => {
    const newNotifications = [...(editingRule.notifications || [])];
    if (field === "type") {
      newNotifications[index] = { ...newNotifications[index], type: value as any, templateId: undefined };
    } else {
      newNotifications[index] = { ...newNotifications[index], [field]: value } as any;
    }
    setEditingRule({ ...editingRule, notifications: newNotifications });
  };

  const updateNotificationTemplate = (index: number, templateId: string) => {
    const newNotifications = [...(editingRule.notifications || [])];
    newNotifications[index] = { ...newNotifications[index], templateId };
    setEditingRule({ ...editingRule, notifications: newNotifications });
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="create" className="w-full flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="create">创建规则</TabsTrigger>
          <TabsTrigger value="list">规则列表</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              基本信息
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ruleName">规则名称 *</Label>
                <Input
                  id="ruleName"
                  placeholder="例如：高频支付失败"
                  value={editingRule.name || ""}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tagKey">触发字段 *</Label>
                  <Select
                    value={(editingRule.tagKey as any) || ""}
                    onValueChange={(value: any) => setEditingRule({ ...editingRule, tagKey: value })}
                  >
                    <SelectTrigger id="tagKey">
                      <SelectValue placeholder="选择字段" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="タイム">タイム</SelectItem>
                      <SelectItem value="タスク数">タスク数</SelectItem>
                      <SelectItem value="サマリ要因">サマリ要因</SelectItem>
                      <SelectItem value="状况現況">状况現況</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tagType">字段类型</Label>
                  <Select
                    value={editingRule.tagType}
                    onValueChange={(value: any) => setEditingRule({ ...editingRule, tagType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">文字 (text)</SelectItem>
                      <SelectItem value="time">时间 (time)</SelectItem>
                      <SelectItem value="number">数字 (number)</SelectItem>
                      <SelectItem value="enum">枚举 (enum)</SelectItem>
                      <SelectItem value="boolean">布尔 (boolean)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="severity">严重度</Label>
                <Select
                  value={editingRule.severity}
                  onValueChange={(value: any) => setEditingRule({ ...editingRule, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">信息 (Info)</SelectItem>
                    <SelectItem value="warning">警告 (Warning)</SelectItem>
                    <SelectItem value="critical">严重 (Critical)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">判断条件</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="operator">运算符</Label>
                <Select
                  value={editingRule.operator}
                  onValueChange={(value) => setEditingRule({ ...editingRule, operator: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {editingRule.tagType === "text" && (
                      <>
                        <SelectItem value="CONTAINS">包含 (CONTAINS)</SelectItem>
                        <SelectItem value="NOT_CONTAINS">不包含 (NOT_CONTAINS)</SelectItem>
                        <SelectItem value="MATCHES">正则匹配 (MATCHES)</SelectItem>
                      </>
                    )}
                    {editingRule.tagType === "number" && (
                      <>
                        <SelectItem value=">">大于 {'(>)'}</SelectItem>
                        <SelectItem value=">=">大于等于 {'(>=)'}</SelectItem>
                        <SelectItem value="<">小于 {'(<)'}</SelectItem>
                        <SelectItem value="<=">小于等于 {'(<=)'}</SelectItem>
                        <SelectItem value="=">等于 (=)</SelectItem>
                        <SelectItem value="BETWEEN">区间 (BETWEEN)</SelectItem>
                      </>
                    )}
                    {editingRule.tagType === "enum" && (
                      <>
                        <SelectItem value="IN">属于 (IN)</SelectItem>
                        <SelectItem value="NOT_IN">不属于 (NOT_IN)</SelectItem>
                      </>
                    )}
                    {editingRule.tagType === "boolean" && (
                      <>
                        <SelectItem value="==">等于</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {editingRule.tagType === "enum" && (
                <div>
                  <Label>匹配值（逗号分隔）</Label>
                  <Input
                    placeholder="例如：503,网关超时,支付失败"
                    value={editingRule.values?.join(",") || ""}
                    onChange={(e) => setEditingRule({
                      ...editingRule,
                      values: e.target.value.split(",").map(v => v.trim()).filter(Boolean)
                    })}
                  />
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">聚合与阈值</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="window">时间窗口（分钟）</Label>
                <Input
                  id="window"
                  type="number"
                  value={editingRule.windowMinutes}
                  onChange={(e) => setEditingRule({ ...editingRule, windowMinutes: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="threshold">触发阈值</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={editingRule.threshold}
                  onChange={(e) => setEditingRule({ ...editingRule, threshold: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="cooldown">冷却期（秒）</Label>
                <Input
                  id="cooldown"
                  type="number"
                  value={editingRule.cooldownSeconds}
                  onChange={(e) => setEditingRule({ ...editingRule, cooldownSeconds: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>通知渠道</h3>
              <Button size="sm" variant="outline" onClick={addNotificationChannel}>
                <Plus className="w-4 h-4 mr-2" />
                添加渠道
              </Button>
            </div>
            <div className="space-y-3">
              {editingRule.notifications?.map((notification, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-3">
                    <Label className="sr-only">渠道类型</Label>
                    <Select
                      value={notification.type}
                    onValueChange={(value: string) => updateNotificationChannel(index, "type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择渠道" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">邮箱 (Email)</SelectItem>
                        <SelectItem value="teams">Teams</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-4">
                    <Label className="sr-only">使用模板</Label>
                    <Select
                      value={notification.templateId || ""}
                      onValueChange={(value: string) => updateNotificationTemplate(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择模板" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.filter(t => t.type === notification.type).map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-4">
                    <Input
                      placeholder={
                        notification.type === "email"
                          ? "ops@company.com"
                          : notification.type === "teams"
                          ? "Teams Webhook URL"
                          : "Webhook URL"
                      }
                      value={notification.target}
                      onChange={(e) => updateNotificationChannel(index, "target", e.target.value)}
                    />
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeNotificationChannel(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {editingRule.notifications?.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  暂无通知渠道，点击"添加渠道"开始配置
                </p>
              )}
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditingRule({})}>
              重置
            </Button>
            <Button onClick={handleCreateRule} className="bg-green-600 hover:bg-green-700">
              创建规则
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4>{rule.name}</h4>
                      <Badge
                        variant="outline"
                        className={
                          rule.severity === "critical"
                            ? "border-red-500 text-red-500"
                            : rule.severity === "warning"
                            ? "border-orange-500 text-orange-500"
                            : "border-blue-500 text-blue-500"
                        }
                      >
                        {rule.severity}
                      </Badge>
                      {rule.enabled ? (
                        <Badge className="bg-green-100 text-green-700 border-0">启用中</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 border-0">已禁用</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        标签: <span className="font-mono">{rule.tagKey}</span> ({rule.tagType})
                      </p>
                      <p>
                        条件: {rule.operator} {rule.values.length > 0 && `[${rule.values.join(", ")}]`}
                      </p>
                      <p>
                        窗口: {rule.windowMinutes}分钟 | 阈值: {rule.threshold} | 冷却: {rule.cooldownSeconds}秒
                      </p>
                      <p>
                        通知: {rule.notifications.map(n => n.type).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => handleToggleRule(rule.id)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
