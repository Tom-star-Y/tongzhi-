import { useState } from "react";
import { Bell, Settings, ChevronDown, Play, Eye, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { SettingsDialog } from "./SettingsDialog";

export function Dashboard() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
              <span className="text-white">AI</span>
            </div>
            <span>ON</span>
          </div>
          <nav className="flex items-center gap-6">
            <button className="text-gray-600 hover:text-gray-900">仪表盘</button>
            <button className="text-gray-600 hover:text-gray-900">タスクのページ</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px]">
              1
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">AION太</span>
            <span className="text-gray-400 text-sm">Sales rep</span>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 space-y-2">
            <div className="text-gray-500 text-xs px-3 py-2">サーバー利用者</div>
            <button className="w-full text-left px-3 py-2 rounded bg-green-50 text-green-700">
              タスクのページ
            </button>
            <div className="text-gray-500 text-xs px-3 py-2 mt-4">歴史记录</div>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
              カスタマーセンター
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Agent Card with Settings */}
            <div className="bg-white rounded-lg p-6 flex items-start gap-4 relative">
              <div className="w-16 h-16 bg-green-400 rounded-lg flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl">主才</h2>
                  <span className="text-gray-500">ヒーカ</span>
                  <Badge className="bg-green-100 text-green-700 border-0">完全に終了</Badge>
                </div>
                <p className="text-gray-600 text-sm">子供は好評（8） 統計者業するさびしす</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Task Report */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2">
                  <span className="text-green-600">📄</span>
                  タスクレポート
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    月时
                  </Button>
                  <Button variant="outline" size="sm" className="bg-green-600 text-white border-green-600">
                    週间
                  </Button>
                  <Button variant="outline" size="sm">
                    通话日期
                  </Button>
                  <Button variant="outline" size="sm">
                    遠古以往
                  </Button>
                  <Button variant="outline" size="sm">
                    成果以來
                  </Button>
                  <span className="text-sm text-gray-600">1 / 1/2025 ～ 8 / 1 /2025 参</span>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    ＋ タスクづく
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-gray-600 text-sm mb-1">昨行タスク数</div>
                  <div className="text-3xl">0<span className="text-base">回</span></div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm mb-1">問題總通話数</div>
                  <div className="text-3xl text-orange-500">9<span className="text-base">回</span></div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm mb-1">違約学数</div>
                  <div className="text-3xl">5<span className="text-base">回</span></div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm mb-1">中呼日前</div>
                  <div className="text-3xl">0<span className="text-base">回</span></div>
                </div>
              </div>

              {/* Call List */}
              <div className="space-y-2">
                <div className="text-sm mb-2">
                  <span className="text-green-600">📞</span> 加朝
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm">タイム</th>
                        <th className="text-left px-4 py-3 text-sm">タスク数</th>
                        <th className="text-left px-4 py-3 text-sm">サマリ要因</th>
                        <th className="text-left px-4 py-3 text-sm">状况現況</th>
                        <th className="text-left px-4 py-3 text-sm">进订</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {callData.map((call, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{call.time}</td>
                          <td className="px-4 py-3 text-sm">{call.count}</td>
                          <td className="px-4 py-3">
                            <Badge className={call.status === "問題" ? "bg-orange-500" : "bg-green-500"}>
                              {call.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{call.summary}</td>
                          <td className="px-4 py-3 text-sm">{call.progress}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Play className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-center pt-4">
                  <Button variant="outline" size="sm">
                    命中 10 件
                  </Button>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2">
                  <span className="text-green-600">📊</span>
                  タスクー覧
                </h3>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  整整タスクを追加
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

const callData = [
  { time: "04/27 21:09:00:02", count: "3", status: "問題", summary: "", progress: "0%" },
  { time: "04/27 21:09:01:10", count: "1", status: "問題", summary: "", progress: "0%" },
  { time: "04/29 12:29:00:45", count: "1", status: "問題", summary: "", progress: "0%" },
  { time: "04/29 22:23:08:11:56", count: "1", status: "問題", summary: "", progress: "0%" },
  { time: "04/30 18:27:08:00:29", count: "13", status: "問題", summary: "", progress: "0%" },
  { time: "04/30 22:22:08:00:16", count: "1", status: "問題", summary: "", progress: "0%" },
  { time: "04/30 22:32:08:01:05", count: "1", status: "問題", summary: "", progress: "0%" },
  { time: "05/01 13:22:08:56:03", count: "8", status: "成功", summary: "", progress: "0%" },
  { time: "05/01 17:01:28:00:02", count: "0", status: "完成中", summary: "", progress: "0%" },
  { time: "05/01 17:01:28:00:05", count: "2", status: "完成中", summary: "", progress: "0%" },
];
