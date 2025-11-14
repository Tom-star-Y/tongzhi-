import { useState } from "react";
import { AlertTriangle, Bell, Info, ExternalLink, Download, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card } from "../ui/card";

interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: "info" | "warning" | "critical";
  triggeredAt: string;
  windowStart: string;
  windowEnd: string;
  count: number;
  callIds: string[];
  read: boolean;
}

export function AlertList() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "alert_001",
      ruleId: "rule_001",
      ruleName: "高频支付失败",
      severity: "critical",
      triggeredAt: "2025-11-14 14:35:22",
      windowStart: "2025-11-14 14:00:00",
      windowEnd: "2025-11-14 14:30:00",
      count: 8,
      callIds: ["call_001", "call_002", "call_003", "call_004", "call_005"],
      read: false
    },
    {
      id: "alert_002",
      ruleId: "rule_002",
      ruleName: "大额退款",
      severity: "warning",
      triggeredAt: "2025-11-14 13:22:15",
      windowStart: "2025-11-14 13:00:00",
      windowEnd: "2025-11-14 13:15:00",
      count: 2,
      callIds: ["call_006", "call_007"],
      read: true
    },
    {
      id: "alert_003",
      ruleId: "rule_003",
      ruleName: "强烈投诉激增",
      severity: "critical",
      triggeredAt: "2025-11-14 12:18:45",
      windowStart: "2025-11-14 12:00:00",
      windowEnd: "2025-11-14 12:10:00",
      count: 4,
      callIds: ["call_008", "call_009", "call_010"],
      read: true
    },
    {
      id: "alert_004",
      ruleId: "rule_001",
      ruleName: "高频支付失败",
      severity: "warning",
      triggeredAt: "2025-11-14 11:05:33",
      windowStart: "2025-11-14 10:30:00",
      windowEnd: "2025-11-14 11:00:00",
      count: 6,
      callIds: ["call_011", "call_012", "call_013"],
      read: true
    }
  ]);

  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterRead, setFilterRead] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== "all" && alert.severity !== filterSeverity) return false;
    if (filterRead === "unread" && alert.read) return false;
    if (filterRead === "read" && !alert.read) return false;
    if (searchQuery && !alert.ruleName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const handleMarkAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const handleExport = () => {
    const csv = [
      ["ID", "规则名称", "严重度", "触发时间", "窗口开始", "窗口结束", "次数", "关联通话"].join(","),
      ...filteredAlerts.map(a => [
        a.id,
        a.ruleName,
        a.severity,
        a.triggeredAt,
        a.windowStart,
        a.windowEnd,
        a.count,
        a.callIds.join(";")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `alerts_${Date.now()}.csv`;
    link.click();
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: "bg-red-100 text-red-700 border-red-300",
      warning: "bg-orange-100 text-orange-700 border-orange-300",
      info: "bg-blue-100 text-blue-700 border-blue-300"
    };
    return colors[severity as keyof typeof colors] || colors.info;
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl mb-1">告警列表</h2>
            <p className="text-sm text-gray-600">
              共 {alerts.length} 条告警，{unreadCount} 条未读
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              全部标为已读
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              导出 CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="搜索规则名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="严重度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部严重度</SelectItem>
              <SelectItem value="critical">严重</SelectItem>
              <SelectItem value="warning">警告</SelectItem>
              <SelectItem value="info">信息</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterRead} onValueChange={setFilterRead}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="unread">未读</SelectItem>
              <SelectItem value="read">已读</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">暂无告警记录</p>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`p-4 transition-colors ${
                !alert.read ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{alert.ruleName}</h4>
                        <Badge className={getSeverityBadge(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {!alert.read && (
                          <Badge className="bg-blue-500 text-white">新</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        触发时间: {alert.triggeredAt}
                      </p>
                    </div>
                    {!alert.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        标为已读
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-600">时间窗口: </span>
                      <span>{alert.windowStart}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">至 </span>
                      <span>{alert.windowEnd}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">触发次数: </span>
                      <span>{alert.count}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">关联通话:</span>
                    {alert.callIds.slice(0, 5).map((callId) => (
                      <Button
                        key={callId}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        {callId}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    ))}
                    {alert.callIds.length > 5 && (
                      <span className="text-sm text-gray-500">
                        +{alert.callIds.length - 5} 更多
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}