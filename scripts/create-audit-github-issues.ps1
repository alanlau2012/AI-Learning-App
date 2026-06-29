# Batch create GitHub issues from reports/issue-tickets-20260628.md
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$report = "reports/issue-tickets-20260628.md"
$footer = @"

---
来源: $report | 审计: 2026-06-28 | commit: 9a11d694
"@

function New-AuditIssue {
    param(
        [string]$Title,
        [string]$Body,
        [string[]]$Labels = @("bug")
    )
    $fullBody = $Body + $footer
    $tmp = New-TemporaryFile
    [System.IO.File]::WriteAllText($tmp.FullName, $fullBody, [System.Text.UTF8Encoding]::new($false))
    $args = @("issue", "create", "--title", $Title, "--body-file", $tmp.FullName)
    foreach ($l in $Labels) { $args += @("--label", $l) }
    & gh @args
    Remove-Item $tmp -Force
    Start-Sleep -Milliseconds 400
}

$issues = @(
    @{
        Title = '[Audit 20260628] 问题单聚合跟踪（架构/UI/内容诊断题）'
        Labels = @('documentation')
        Body = @'
## 结论
有条件通过 | P0=0 P1=23 P2=13 P3=7

## 子报告
- reports/issue-tickets-architecture-20260628.md
- reports/issue-tickets-uiux-visual-20260628.md
- reports/issue-tickets-content-diag-20260628.md

## Top 3
1. 诊断题结构泄漏
2. tokens.css 缺 warning-soft / 动画 token
3. Header 面包屑未覆盖 /scenarios
'@
    },
    @{
        Title = '[P1][Architecture] ARCH-P1-01: Header 面包屑未覆盖 /scenarios'
        Body = @'
## 位置
src/components/layout/Header.tsx:16-33

## 现象
buildBreadcrumb 未识别 /scenarios 与 /scenarios/:scenarioId

## 修复
补两个分支，用 scenarioExerciseById 查标题
'@
    },
    @{
        Title = '[P1][UI] UI-P1-01: 缺 --color-warning-soft，告警软背景硬编码'
        Body = @'
## 位置
tokens.css + OptionCard/ExplanationPanel/ProfilePage/ScenarioPage 共 4+ 处

## 修复
tokens.css 加 --color-warning-soft / --color-warning-border
'@
    },
    @{
        Title = '[P1][UI] UI-P1-02: 动画画布配色约230处硬编码'
        Body = @'
## 位置
src/components/animation/*.module.css

## 修复
tokens.css 加 --anim-canvas-* 系列 token
'@
    },
    @{
        Title = '[P1][UI] UI-P1-03: ProfilePage danger 棕色文本 #9a520f'
        Body = @'
## 位置
ProfilePage.module.css:368

## 修复
改用 var(--color-warning) 或 --color-warning-text
'@
    },
    @{
        Title = '[P1][UI] UI-P1-04: ScenarioPage metricCard 状态色硬编码'
        Body = @'
## 位置
ScenarioPage.module.css:133,138,139

## 修复
并入 UI-P1-01 warning/progress token 体系
'@
    },
    @{
        Title = '[P1][Content] CONTENT-P1-SYS: 12道诊断题最长选项即正确答案'
        Body = @'
## 现象
约22%单选题正确答案明显最长

## 涉及讲
value-review-agent, permission-governance, ops-diagnosis-agent, eval, test-generation-agent, requirement-decomposition-agent, reasoning-limit, ai-native-org, code-review-agent, multi-agent, context-window, repo-context

## 修复
4选项字数差<=4字；缩短正确答案或升级干扰项
'@
    },
    @{
        Title = '[P1][Content] CONTENT-P1-01: cost-routing 干扰项荒谬'
        Body = 'conceptId: cost-routing。将1个干扰项改为可信工程动作。'
    },
    @{
        Title = '[P1][Content] CONTENT-P1-02: maas 干扰项荒谬'
        Body = 'conceptId: maas。将C改为SDK统一埋点类强干扰项。'
    },
    @{
        Title = '[P1][Content] CONTENT-P1-03: sla 双重结构泄漏'
        Body = 'conceptId: sla。拆C或加长干扰项。'
    },
    @{
        Title = '[P1][Content] CONTENT-P1-04: permission-governance 双重泄漏'
        Body = 'conceptId: permission-governance。B改为防注入规则等可信过渡措施。'
    },
    @{
        Title = '[P1][Content] CONTENT-P1-05: ttft 多选题干直接映射答案'
        Body = 'conceptId: ttft。加入1个看似对应但应排除的迷惑项。'
    },
    @{
        Title = '[P1][Content] CONTENT-P1-06: token-cost-spike prefix 口径不严谨'
        Body = 'retry-cache-storm nextStepRecommendations。权限作cache key命名空间，prefix只承载稳定提示。'
    },
    @{
        Title = '[P2][Architecture] ARCH-P2-01: ScenarioPage 状态色硬编码'
        Body = '关联 UI-P1-04。抽到 tokens.css。'
    },
    @{
        Title = '[P2][Architecture] ARCH-P2-02: ProfilePage 告警色硬编码'
        Body = '关联 UI-P1-03。抽到 tokens.css。'
    },
    @{
        Title = '[P2][Architecture] ARCH-P2-03: 导航 label 与顺序不一致'
        Body = 'BottomNav vs Sidebar：场景演练 vs 场景。抽出统一 nav 常量。'
    },
    @{
        Title = '[P2][Architecture] ARCH-P2-04: conceptById/scenarioById 重复构造'
        Body = '4处重复Map。data层暴露唯一byId映射。'
    },
    @{
        Title = '[P2][UI] UI-P2-01: HomePage primaryBtn hover #1838b8'
        Body = 'tokens.css 加 --color-primary-hover。'
    },
    @{
        Title = '[P2][UI] UI-P2-02: 统计大数字应改 mono 非 serif'
        Body = 'ScenariosPage/ScenarioPage stats strong 改 var(--font-mono)。'
    },
    @{
        Title = '[P2][UI] UI-P2-03: tokens.css 缺 spacing scale'
        Body = '增补 --space-* token。'
    },
    @{
        Title = '[P2][UI] UI-P2-04: 诊断题边框 rgba 硬编码'
        Body = 'OptionCard/ExplanationPanel/DecisionGuideSection 随 border token 收口。'
    },
    @{
        Title = '[P2][UI] UI-P2-05: ScenarioPage optionActive box-shadow'
        Body = '可改 border 优先（可选）。'
    },
    @{
        Title = '[P2][Content] CONTENT-P2-01: token-roi 选项偏口号'
        Body = '补具体可执行动作。'
    },
    @{
        Title = '[P2][Content] CONTENT-P2-02: ai-native-org 选项偏理念'
        Body = 'troubleshootingPath 补 RACI/Agent操作手册。'
    },
    @{
        Title = '[P2][Content] CONTENT-P2-03: ttft 多选需UI标注'
        Body = '题干或UI显式标注多选。'
    },
    @{
        Title = '[P2][Content] CONTENT-P2-04: trace-not-diagnostic hash反查'
        Body = 'hash应使用带盐或不可逆指纹。'
    },
    @{
        Title = '[P3][Architecture] ARCH-P3-01: progress.ts/progressCore 分工不清'
        Labels = @('enhancement')
        Body = '文件头注释写清职责。'
    },
    @{
        Title = '[P3][Architecture] ARCH-P3-02: completeScenario 完成即入复盘'
        Labels = @('enhancement')
        Body = '注释写清或拆开。'
    },
    @{
        Title = '[P3][Architecture] ARCH-P3-03: HomePage 手工拼 progress'
        Labels = @('enhancement')
        Body = '直接传 store 完整状态。'
    },
    @{
        Title = '[P3][Architecture] ARCH-P3-04: import 带 .ts 扩展名'
        Labels = @('enhancement')
        Body = '去掉扩展名（历史问题）。'
    },
    @{
        Title = '[P3][Architecture] ARCH-P3-05: scenarioSimulation.ts 883行'
        Labels = @('enhancement')
        Body = '按职责拆分子模块（历史问题）。'
    },
    @{
        Title = '[P3][UI] UI-P3-01: ScenariosPage filters !important'
        Labels = @('enhancement')
        Body = '提高 selector 特异性。'
    },
    @{
        Title = '[P3][UI] UI-P3-02: selection 背景硬编码'
        Labels = @('enhancement')
        Body = '加 --color-selection token。'
    },
    @{
        Title = '[P3][Content] CONTENT-P3-01: sampling 术语'
        Labels = @('enhancement')
        Body = '低随机采样改为低 temperature/top-p 采样。'
    },
    @{
        Title = '[P3][Content] CONTENT-P3-02: concept JSON 缩进不统一'
        Labels = @('enhancement')
        Body = '主开发合入时统一。'
    },
    @{
        Title = '[Audit 20260628] 补审跟踪：未覆盖角度'
        Labels = @('documentation')
        Body = @'
未审: UI交互/无障碍, 决策手册17条, 场景+能力域+rolePaths, 56讲正文+glossary
建议: composer-2.5-fast 拆小任务重跑
'@
    }
)

$created = @()
foreach ($item in $issues) {
    $labels = if ($item.Labels) { $item.Labels } else { @('bug') }
    Write-Host "Creating: $($item.Title)"
    $url = New-AuditIssue -Title $item.Title -Body $item.Body -Labels $labels
    $created += $url
}

Write-Host "`nCreated $($created.Count) issues:"
$created | ForEach-Object { Write-Host $_ }
