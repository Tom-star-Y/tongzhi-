import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { RuleCreation } from "./settings/RuleCreation";
import { NotificationTemplates } from "./settings/NotificationTemplates";
import { AlertList } from "./settings/AlertList";
import { cn } from "./ui/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TemplatesProvider } from "@/lib/templates-store";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Tab = "rules" | "templates" | "alerts";

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<Tab>("rules");
  const [alertSectionExpanded, setAlertSectionExpanded] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-[1600px] h-[85vh] p-0 overflow-hidden">
        <div className="flex h-full min-h-0">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4 flex flex-col">
            <DialogHeader className="mb-6">
              <DialogTitle>员工设置</DialogTitle>
            </DialogHeader>
            <nav className="space-y-1 flex-1">
              {/* 一级标题：告警通知设置 */}
              <button
                onClick={() => setAlertSectionExpanded(!alertSectionExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
              >
                <span>告警通知设置</span>
                {alertSectionExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {/* 二级菜单 */}
              {alertSectionExpanded && (
                <div className="ml-4 space-y-1 mt-1">
                  <button
                    onClick={() => setActiveTab("rules")}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded transition-colors text-sm",
                      activeTab === "rules"
                        ? "bg-green-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    规则创建
                  </button>
                  <button
                    onClick={() => setActiveTab("templates")}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded transition-colors text-sm",
                      activeTab === "templates"
                        ? "bg-green-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    通知模板
                  </button>
                  <button
                    onClick={() => setActiveTab("alerts")}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded transition-colors text-sm",
                      activeTab === "alerts"
                        ? "bg-green-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    告警列表
                  </button>
                </div>
              )}
            </nav>
          </div>

          {/* Main Content */}
          <TemplatesProvider>
            <div className="flex-1 min-w-0 min-h-0 overflow-auto bg-white">
              {activeTab === "rules" && <RuleCreation />}
              {activeTab === "templates" && <NotificationTemplates />}
              {activeTab === "alerts" && <AlertList />}
            </div>
          </TemplatesProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
