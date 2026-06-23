import type { KnowledgePoint } from '../types';
import { applyV2Revisions } from '../utils/applyV2Revisions.ts';

/**
 * MVP 样板与扩展内容。
 * 来源：content/drafts/*.json，经 reviews/content-review-12-lessons-round-02.md 复核通过后由主开发入库。
 * v2 正文改版由 applyV2Revisions 在导出时合并（docs/content-schema.md §7）。
 */
const rawDemoConcepts: KnowledgePoint[] = [
  {
    "id": "token",
    "title": "Token",
    "slug": "token",
    "moduleId": "m1",
    "order": 1,
    "difficulty": "basic",
    "estimatedMinutes": 8,
    "tags": [
      "Token",
      "Tokenizer",
      "成本治理",
      "上下文窗口",
      "TTFT"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "Token 是模型处理文本时使用的基础单位，它不是字，也不一定是词。企业 AI 应用中的成本、上下文长度、首字时延和缓存规模，通常都要先换算成 Token 才能治理。",
    "whyItMatters": "Token 是把业务体验翻译成工程指标的入口。输入 Token 会影响 Prefill、上下文窗口和缓存占用，输出 Token 会影响 Decode 时长与计费；如果只看请求次数，不看 Token 结构，成本、性能和质量问题都会被掩盖。",
    "mentalModel": "不要把 Token 当成“字数”的另一种说法。人读到的是一句话，模型读到的是一串被切开、编号的格子；工程团队真正要管理的，是这些格子在计算、缓存和计费系统里的流动量，而不是自然语言的表面长度。",
    "mechanism": [
      "输入文本先经过分词器切分为若干 Token，再映射为词表整数编号并转成向量，成为模型可计算的输入序列；同一汉字、英文词或符号在不同模型中切分方式可能不同。",
      "Prefill 阶段会处理全部输入 Token，输入越长，首字前的计算和 KV Cache 写入越重。",
      "Decode 阶段逐个生成输出 Token，输出越长，用户等待完整答案的时间和费用越高。",
      "上下文窗口限制的是 Token 数，不是字符数；RAG、工具结果和历史对话都会共同占用窗口。",
      "企业平台通常需要按应用、团队、模型和任务统计输入/输出 Token，才能建立成本治理和性能优化闭环。"
    ],
    "animation": {
      "type": "token-flow",
      "title": "从文本到 Token 再到成本与时延",
      "steps": [
        {
          "id": "s1",
          "title": "用户输入文本",
          "description": "业务问题进入模型链路时仍是自然语言，系统需要先把它转换为可计算、可计量的单位。",
          "highlightTargets": [
            "input-text"
          ]
        },
        {
          "id": "s2",
          "title": "分词器切分",
          "description": "文本被切成多个 Token；一个 Token 不等于一个字或一个词，不同语言和符号会出现不同颗粒度。",
          "highlightTargets": [
            "tokenizer",
            "tokens"
          ]
        },
        {
          "id": "s3",
          "title": "映射为编号和向量",
          "description": "每个 Token 映射为词表编号，再进入向量表示；后续计算面对的是编号序列和向量，而不是原始文字。",
          "highlightTargets": [
            "token-ids",
            "embeddings"
          ]
        },
        {
          "id": "s4",
          "title": "输入 Token 影响 Prefill",
          "description": "输入 Token 越多，Prefill 区域越长，首字前等待和缓存写入压力同步增加。",
          "highlightTargets": [
            "prefill",
            "ttft"
          ]
        },
        {
          "id": "s5",
          "title": "输出 Token 逐个生成",
          "description": "输出 Token 按时间轴一个个出现，说明总回答时长和输出计费会随着生成长度增加。",
          "highlightTargets": [
            "decode",
            "output-tokens",
            "cost"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "办公助手的长文总结成本失控",
      "scenario": "某企业办公助手开始支持批量总结会议纪要、附件和邮件线程后，月度模型费用快速上升，但活跃用户数变化不大。",
      "problem": "平台只统计调用次数，没有区分输入 Token、输出 Token、附件长度和历史线程长度，导致成本异常难以定位。",
      "analysis": "很多请求把完整附件、长邮件线程和默认模板一并送入模型，输入 Token 膨胀；部分总结模板还要求“保留所有细节”，输出 Token 也被拉长。",
      "solution": "按任务类型拆分输入/输出 Token 指标，对附件摘要、邮件线程和最终总结设置不同 Token 预算，并把超预算请求纳入成本评审。",
      "takeaway": "Token 不是概念细节，而是企业 AI 成本、时延和上下文治理的共同计量单位。"
    },
    "pitfalls": [
      "把 Token 当成字符数估算预算，导致中文、英文、代码和表格场景下成本预测偏差很大。",
      "只限制输出长度，不限制输入上下文，结果 TTFT 和缓存占用仍然持续上升。",
      "只看平均请求费用，不拆分输入 Token 与输出 Token，无法判断是 RAG 拼接过长还是模型回答过长。",
      "把历史对话无限追加进上下文，误以为“多给信息一定更好”，实际可能增加干扰和成本。",
      "更换模型后沿用旧 Token 估算规则，没有重新校准分词器和计费口径。"
    ],
    "diagnosticQuestion": {
      "id": "q-token-1",
      "type": "single",
      "scenario": "一个办公助手上线附件总结能力后，请求量只增长 20%，但模型账单增长 180%，同时用户反馈首字等待变慢。监控显示输出长度变化不大。",
      "question": "你应优先排查哪一项？",
      "options": [
        {
          "id": "a",
          "text": "是否需要把高频任务切到更便宜的模型以降低单价"
        },
        {
          "id": "b",
          "text": "是否应先统一下调 max output tokens，压缩所有回答长度"
        },
        {
          "id": "c",
          "text": "附件正文、邮件线程和历史会话是否让输入 Token 膨胀"
        },
        {
          "id": "d",
          "text": "是否需要为高频附件增加摘要缓存，减少相同附件的重复处理"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "账单和 TTFT 同时上升，而输出长度变化不大，最可能的第一排查方向是输入 Token 膨胀，尤其是附件正文、邮件线程、系统模板和历史上下文被一起注入。a 可能降低单价，但在未拆分输入/输出 Token 前会掩盖真实瓶颈；b 针对输出长度，和题干“输出长度变化不大”不匹配；d 对重复附件场景有价值，是强干扰项，但应在确认输入 Token 来源和重复率之后再设计缓存策略。",
      "troubleshootingPath": [
        "按请求拆分输入 Token 与输出 Token",
        "统计每次附件、邮件线程和历史会话注入的平均长度",
        "检查历史会话是否被无限追加",
        "识别高频重复附件是否适合摘要缓存",
        "用相同问题对比压缩前后的 TTFT、成本和答案质量"
      ],
      "relatedConceptIds": [
        "context-window",
        "prefill",
        "ttft",
        "token-roi"
      ]
    },
    "keyTakeaways": [
      "Token 是成本、上下文、时延和缓存的共同单位。",
      "输入 Token 主要影响 Prefill 与 TTFT。",
      "输出 Token 主要影响 Decode 总耗时与计费。",
      "上下文越长不等于答案越好。",
      "企业治理要拆分输入和输出 Token。"
    ],
    "relatedConceptIds": [
      "prefill",
      "decode",
      "ttft",
      "context-window",
      "kv-cache",
      "token-roi"
    ]
  },
  {
    "id": "attention",
    "title": "注意力机制",
    "slug": "attention",
    "moduleId": "m1",
    "order": 4,
    "difficulty": "basic",
    "estimatedMinutes": 10,
    "tags": [
      "Attention",
      "Transformer",
      "RAG",
      "上下文污染",
      "长上下文",
      "质量诊断"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "注意力机制是模型在处理一个 Token 时，动态衡量它与上下文中其他 Token 关系强弱的计算方式。它不是人类意识，而是一套用于分配上下文信息权重的工程机制。",
    "whyItMatters": "企业应用的答案质量很大程度取决于模型如何利用上下文。长上下文、低质量检索片段和冲突指令可能改变模型对信息的使用方式，进而影响回答可靠性、可控性和诊断路径；注意力权重可帮助理解机制，但不能被当作完整因果解释。",
    "mentalModel": "在工程上，注意力更像一次会议里的临时发言权分配：不是每句话都同等重要，模型会按当前生成目标给不同上下文片段不同权重。团队能控制的不是“模型听谁的”，而是把哪些材料放进了会议室、谁排在前面。",
    "mechanism": [
      "每个输入 Token 会生成 Query、Key、Value 等表示，用于计算它与其他 Token 的关系。",
      "模型用 Query 和各个 Key 计算相关性分数，得到当前 Token 应关注哪些上下文位置。",
      "相关性分数经过归一化后形成权重，再对 Value 加权汇总，形成当前 Token 的上下文表示。",
      "多层、多头注意力会从不同角度捕捉关系，例如指代、格式、约束、证据片段和任务目标。",
      "上下文越长，计算和显存压力通常越高，同时无关或冲突内容也更可能影响模型对信息的使用。",
      "在企业 RAG 或 Agent 场景中，相关工程现象常表现为模型引用错误片段、忽略关键约束或受旧上下文影响；诊断时还需要结合检索、排序、提示词和评测证据。"
    ],
    "animation": {
      "type": "attention-map",
      "title": "Token 之间的动态权重关系",
      "steps": [
        {
          "id": "s1",
          "title": "上下文进入模型",
          "description": "一组 Token 进入 Transformer，其中既包含问题和证据片段，也可能包含无关或冲突信息。",
          "highlightTargets": [
            "tokens",
            "context"
          ]
        },
        {
          "id": "s2",
          "title": "选择当前 Token",
          "description": "选中当前要理解或生成的位置，说明注意力是围绕当前计算目标动态产生的。",
          "highlightTargets": [
            "current-token"
          ]
        },
        {
          "id": "s3",
          "title": "计算关系权重",
          "description": "当前 Token 会对上下文中不同位置形成不同权重，相关证据和无关片段不会被等价处理。",
          "highlightTargets": [
            "attention-links",
            "attention-map"
          ]
        },
        {
          "id": "s4",
          "title": "上下文污染出现",
          "description": "冲突或过时信息进入上下文后，模型对信息的利用可能受到干扰，答案依据需要额外校验。",
          "highlightTargets": [
            "pollution",
            "shifted-weights"
          ]
        },
        {
          "id": "s5",
          "title": "工程治理上下文",
          "description": "通过片段筛选、排序和压缩减少噪声，让高相关证据重新占据主要权重。",
          "highlightTargets": [
            "rerank",
            "clean-context"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "合同问答引用了过期条款",
      "scenario": "某企业用 RAG 构建合同问答助手，用户询问最新审批权限时，模型引用了旧版制度。",
      "problem": "检索结果同时包含新版和旧版制度，提示词没有明确版本优先级，模型输出看似合理但依据错误。",
      "analysis": "注意力并不会自动理解企业制度的生效顺序。旧版条款语言更接近问题时，模型可能更容易利用这段材料；但是否构成直接因果，需要结合检索排序、引用来源和回归评测确认。",
      "solution": "在检索阶段加入版本过滤和生效日期排序，在上下文中显式标记权威来源，并用评测集覆盖冲突文档场景。",
      "takeaway": "注意力机制能利用上下文，也会放大上下文治理缺陷；企业质量控制必须前置到检索和上下文编排。"
    },
    "pitfalls": [
      "把注意力解释成模型真的“理解了重点”，忽略它只是计算得到的权重关系。",
      "认为长上下文天然更可靠，把过多低相关文档塞入提示词，反而增加干扰。",
      "只优化 Prompt 文字，不治理 RAG 片段排序、去重和版本过滤。",
      "看到答案流畅就认为依据正确，没有检查模型实际引用的上下文来源。",
      "把一次错误归因于模型能力不足，却没有排查上下文污染和证据冲突。"
    ],
    "diagnosticQuestion": {
      "id": "q-attention-1",
      "type": "single",
      "scenario": "企业知识库问答中，同一问题有时引用新版制度，有时引用旧版制度。日志显示两类文档都被检索进上下文，且旧版文档文本更接近用户问法。",
      "question": "最优先的治理动作是什么？",
      "options": [
        {
          "id": "a",
          "text": "扩大上下文窗口，把新版和旧版制度都完整放进去，避免遗漏"
        },
        {
          "id": "b",
          "text": "把温度调到 0，并要求模型必须在答案中引用来源"
        },
        {
          "id": "c",
          "text": "只在答案后处理阶段检查引用格式是否完整"
        },
        {
          "id": "d",
          "text": "在检索与上下文编排中加入版本过滤、排序和权威来源标记"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "问题来自新版和旧版制度同时进入上下文，且旧版文本更接近用户问法，因此第一步应治理进入上下文的材料质量和优先级。a 会扩大冲突材料暴露面，可能加重干扰；b 能降低采样随机性、改善引用纪律，但如果旧版材料仍被高权重使用，答案仍可能引用错误依据；c 只能检查格式，不能判断引用是否权威。正确动作是先在检索、排序和上下文编排中表达版本、生效日期和权威来源。",
      "troubleshootingPath": [
        "查看命中片段的版本、生效日期和来源",
        "检查 rerank 是否考虑权威性而不只考虑文本相似度",
        "在上下文中显式标记最新制度和作废制度",
        "为冲突文档建立回归评测用例",
        "对答案引用来源做可观测记录"
      ],
      "relatedConceptIds": [
        "context-window",
        "context-pollution",
        "eval"
      ]
    },
    "keyTakeaways": [
      "注意力是 Token 间的动态权重，不是意识。",
      "上下文质量会直接影响模型判断。",
      "长上下文会带来计算压力和信息干扰。",
      "RAG 的质量问题常常是注意力被错误材料牵引。",
      "治理重点是筛选、排序和标记上下文。"
    ],
    "relatedConceptIds": [
      "transformer",
      "context-window",
      "context-pollution",
      "eval"
    ]
  },
  {
    "id": "prefill",
    "title": "Prefill",
    "slug": "prefill",
    "moduleId": "m2",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 10,
    "tags": [
      "Prefill",
      "TTFT",
      "KV Cache",
      "上下文窗口",
      "推理性能"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "Prefill 是模型在生成第一个输出 Token 之前，处理完整输入上下文的推理阶段。它通常决定首字前等待的主要计算量，并会为后续 Decode 生成 KV Cache。",
    "whyItMatters": "企业 AI 应用里，用户经常把“系统没反应”归因于模型慢，但根因可能是 Prefill 被长 Prompt、RAG 片段、历史会话或工具结果放大。理解 Prefill 才能正确优化 TTFT、上下文预算和缓存策略。",
    "mentalModel": "反过来看，模型在吐出第一个字之前并没有闲着——Prefill 就是它的“读卷阶段”：题目、材料、附录和历史记录越长，读卷越久，首字前的等待也越久；读完后形成的笔记，正是后续生成可复用的缓存。",
    "mechanism": [
      "请求到达推理服务后，系统把系统提示词、用户问题、历史会话、RAG 片段和工具结果拼成输入上下文。",
      "分词器将上下文转换为输入 Token 序列，输入长度决定 Prefill 需要处理的规模。",
      "模型通常会并行处理这些输入 Token，计算各层注意力所需的 Key、Value 等中间结果。",
      "Prefill 结束时，推理服务写入 KV Cache，并准备开始生成第一个输出 Token。",
      "如果上下文过长、队列拥塞或缓存未命中，Prefill 阶段会显著拉高 TTFT。",
      "优化 Prefill 往往不是简单换大模型，而是减少无效上下文、改进调度、复用缓存和拆分任务链路。"
    ],
    "animation": {
      "type": "prefill-decode",
      "title": "Prefill 如何影响首字时延",
      "steps": [
        {
          "id": "s1",
          "title": "组装完整上下文",
          "description": "系统提示词、用户问题、历史消息和外部资料在请求前被拼成一个输入序列。",
          "highlightTargets": [
            "prompt",
            "rag-chunks",
            "history"
          ]
        },
        {
          "id": "s2",
          "title": "进入 Prefill",
          "description": "整段输入 Token 进入 Prefill 阶段，序列越长，首字前需要处理的计算规模越大。",
          "highlightTargets": [
            "input-tokens",
            "prefill"
          ]
        },
        {
          "id": "s3",
          "title": "写入 KV Cache",
          "description": "模型为上下文生成 Key 和 Value，并把它们写入缓存，为后续 Decode 复用。",
          "highlightTargets": [
            "kv-write",
            "cache"
          ]
        },
        {
          "id": "s4",
          "title": "首个 Token 准备输出",
          "description": "Prefill 完成后，模型才具备生成首个输出 Token 的条件，TTFT 接近结束。",
          "highlightTargets": [
            "first-token",
            "ttft"
          ]
        },
        {
          "id": "s5",
          "title": "长上下文拖慢首字",
          "description": "输入膨胀会优先拉长首字前的 Prefill 阶段，而不是只影响完整回答的总时长。",
          "highlightTargets": [
            "long-context",
            "ttft-growth"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "审批 Agent 首字慢但输出速度正常",
      "scenario": "某企业审批 Agent 接入流程系统后，首字等待从 1 秒增加到 5 秒，但开始输出后速度基本稳定。",
      "problem": "团队只观察总耗时，没有拆分 Prefill 和 Decode，误以为需要优化流式输出。",
      "analysis": "输出速度稳定说明 Decode 不是主要瓶颈；工具返回的审批历史、表单字段和权限矩阵被原样拼入上下文，导致输入 Token 增长，Prefill 成为 TTFT 的主要来源。",
      "solution": "对工具返回字段做白名单和摘要，压缩历史审批记录，并单独监控 Prefill 耗时、输入 Token、工具返回体积与 TTFT。",
      "takeaway": "首字慢通常要先看 Prefill 链路，而不是只看模型生成速度。"
    },
    "pitfalls": [
      "把 TTFT 变慢直接归因于 Decode 慢，没有拆分首字前和首字后的耗时。",
      "认为 RAG 片段越多越安全，忽略 Prefill 计算和注意力干扰。",
      "只监控请求耗时平均值，不记录输入 Token、Prefill 时间和缓存命中状态。",
      "把工具返回的大段 JSON 原样塞入上下文，导致首字等待不可控。",
      "扩容后仍随机路由多轮会话，使缓存无法复用，Prefill 被反复触发。"
    ],
    "diagnosticQuestion": {
      "id": "q-prefill-1",
      "type": "single",
      "scenario": "一个审批 Agent 接入新版流程查询工具后，TTFT 从 900ms 上升到 4.5s；开始输出后 TPOT 基本不变。日志显示每次请求注入的工具返回字段和历史记录长度增加了 3 倍。",
      "question": "你最应该优先优化什么？",
      "options": [
        {
          "id": "a",
          "text": "筛选和摘要工具返回内容，减少无效输入上下文"
        },
        {
          "id": "b",
          "text": "先扩容推理服务并预热实例，降低高峰期排队对 TTFT 的影响"
        },
        {
          "id": "c",
          "text": "把流式缓冲间隔调小，让客户端更频繁刷新"
        },
        {
          "id": "d",
          "text": "提高最大输出 Token，减少模型提前停止的概率"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "TTFT 上升而 TPOT 不变，且工具返回字段和历史记录长度增加 3 倍，说明瓶颈更可能在 Prefill 输入处理。b 是合理但优先级不对的强干扰项：如果排队是主因，扩容和预热有价值，但题干直接指向输入上下文膨胀，应先减小无效输入并复测；c 只改善前端刷新体感，不缩短服务端首个 Token 产生时间；d 会增加输出预算，与首字前瓶颈无关。",
      "troubleshootingPath": [
        "拆分 TTFT、Prefill 耗时和 Decode 耗时",
        "统计请求输入 Token 与工具返回体积",
        "对白名单字段和历史记录做摘要压缩",
        "对比片段压缩前后的答案质量和首字时延",
        "检查 KV Cache 是否在多轮会话中复用"
      ],
      "relatedConceptIds": [
        "ttft",
        "decode",
        "kv-cache",
        "context-window"
      ]
    },
    "keyTakeaways": [
      "Prefill 是首字前处理完整输入的阶段。",
      "输入越长，Prefill 压力通常越高。",
      "Prefill 会生成后续 Decode 使用的 KV Cache。",
      "TTFT 诊断必须拆出 Prefill 视角。",
      "减少无效上下文往往比盲目扩容更有效。"
    ],
    "relatedConceptIds": [
      "token",
      "decode",
      "ttft",
      "kv-cache",
      "context-window",
      "session-affinity"
    ]
  },
  {
    "id": "decode",
    "title": "Decode",
    "slug": "decode",
    "moduleId": "m2",
    "order": 2,
    "difficulty": "intermediate",
    "estimatedMinutes": 10,
    "tags": [
      "Decode",
      "TPOT",
      "推理性能",
      "投机解码",
      "量化"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "Decode 是模型在 Prefill 之后逐 Token 生成输出的阶段。它决定答案流出的持续速度，输出越长，总生成时间和费用通常越高。",
    "whyItMatters": "很多企业应用不只要求“首字快”，还要求长报告、代码修改、总结和客服回复持续输出稳定。Decode 速度会影响用户等待、GPU 利用率、并发吞吐和输出 Token 成本，是推理服务体验治理的核心指标之一。",
    "mentalModel": "如果 Prefill 是读卷，Decode 就是逐字写答案。读完材料后，模型每写一个新 Token 都要参考已经写出的内容；答案越长，写作时间越长，系统越需要控制节奏和预算。",
    "mechanism": [
      "Prefill 完成后，模型基于输入上下文和已有 KV Cache 生成第一个输出 Token。",
      "每生成一个新 Token，该 Token 会被追加到上下文，并更新对应的 KV Cache。",
      "模型继续基于历史输入和已生成输出预测下一个 Token，形成逐步自回归过程。",
      "TPOT 常用于衡量输出阶段每个 Token 的平均生成时间，直接影响流式输出体感。",
      "输出越长，Decode 循环次数越多，总耗时和输出计费越高。",
      "投机解码、量化、批处理调度和模型大小都会影响 Decode 阶段的吞吐与稳定性。"
    ],
    "animation": {
      "type": "prefill-decode",
      "title": "Decode 的逐 Token 生成过程",
      "steps": [
        {
          "id": "s1",
          "title": "Prefill 完成",
          "description": "输入上下文已经处理完毕，KV Cache 就绪，推理链路从首字前阶段进入生成阶段。",
          "highlightTargets": [
            "prefill-done",
            "cache"
          ]
        },
        {
          "id": "s2",
          "title": "生成第一个输出 Token",
          "description": "第一个输出 Token 出现，说明用户已经看到响应，但完整答案还没有完成。",
          "highlightTargets": [
            "first-output-token"
          ]
        },
        {
          "id": "s3",
          "title": "追加并继续预测",
          "description": "新 Token 被追加进上下文，模型基于已有内容继续预测下一个 Token。",
          "highlightTargets": [
            "append-token",
            "decode-loop"
          ]
        },
        {
          "id": "s4",
          "title": "TPOT 体现流出速度",
          "description": "时间轴上相邻 Token 的间隔变成 TPOT 指标，间隔越大，用户越觉得输出卡顿。",
          "highlightTargets": [
            "tpot",
            "token-interval"
          ]
        },
        {
          "id": "s5",
          "title": "长输出累积总耗时",
          "description": "即使 TPOT 保持稳定，输出 Token 过多也会累积成较长的总等待时间。",
          "highlightTargets": [
            "long-output",
            "total-latency"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "代码生成 Agent 输出后半段变慢",
      "scenario": "某研发团队使用代码生成 Agent 自动生成迁移脚本，首字很快，但长代码块输出到后半段明显变慢。",
      "problem": "用户认为模型“不稳定”，平台只看 TTFT，没有持续跟踪 TPOT、输出长度和批调度状态。",
      "analysis": "任务输出 Token 很长，Decode 循环次数多；高峰期批处理调度和显存压力使后续 Token 间隔变大。",
      "solution": "建立 TPOT、输出 Token、队列等待和批大小监控；对长代码任务拆分生成步骤，设置输出预算，并评估投机解码或量化方案。",
      "takeaway": "长输出体验不能只靠首字时延判断，Decode 阶段需要独立观测和治理。"
    },
    "pitfalls": [
      "只优化 TTFT，忽略长答案流式输出中后段的卡顿。",
      "把最大输出 Token 设得很大，却没有配套成本和超时控制。",
      "用平均响应时间评估所有任务，混淆短问答和长代码生成的 Decode 特征。",
      "盲目开启更激进的解码优化，没有用质量评测验证答案稳定性。",
      "把前端流式展示问题和后端 Decode 性能问题混在一起排查。"
    ],
    "diagnosticQuestion": {
      "id": "q-decode-1",
      "type": "single",
      "scenario": "某代码生成应用首字稳定在 700ms 左右，但生成 300 行迁移脚本时经常超过 90 秒。监控显示输入 Token 不大，输出 Token 很长，TPOT 在高峰期升高。",
      "question": "最合理的优先治理方向是什么？",
      "options": [
        {
          "id": "a",
          "text": "优先压缩输入上下文，因为首字稳定仍可能隐藏 Prefill 问题"
        },
        {
          "id": "b",
          "text": "增加推理副本数，但暂不区分短问答和长代码任务的调度队列"
        },
        {
          "id": "c",
          "text": "拆分长输出任务，监控并优化 TPOT、批调度和输出预算"
        },
        {
          "id": "d",
          "text": "开启更激进的解码优化，并在质量评测通过前全量发布"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "首字稳定、输入不大、输出 Token 很长且高峰期 TPOT 升高，主要压力在 Decode。a 对 Prefill 有用，但题干不支持先压输入；b 是强干扰项，扩容可能缓解总体排队，但如果不拆分长短任务和 TPOT，就无法治理长代码生成的持续输出瓶颈；d 可能改善速度，但未通过质量评测前全量发布会引入回归风险。第一步应围绕输出长度、TPOT、批调度和预算建立治理。",
      "troubleshootingPath": [
        "按任务类型统计输出 Token 分布",
        "拆分 TTFT 与 TPOT 指标",
        "观察高峰期批大小、队列等待和 GPU 利用率",
        "区分短问答和长代码任务的调度策略",
        "评估长输出拆段、停止条件和解码优化对质量的影响"
      ],
      "relatedConceptIds": [
        "prefill",
        "ttft",
        "tpot",
        "speculative-decoding",
        "quantization"
      ]
    },
    "keyTakeaways": [
      "Decode 是逐 Token 生成输出的阶段。",
      "输出越长，总耗时和费用越高。",
      "TPOT 更能反映输出阶段体感。",
      "长输出任务需要预算、拆分和停止条件。",
      "解码优化必须结合质量评测。"
    ],
    "relatedConceptIds": [
      "prefill",
      "ttft",
      "tpot",
      "kv-cache",
      "speculative-decoding",
      "quantization"
    ]
  },
  {
    "id": "ttft",
    "title": "TTFT",
    "slug": "ttft",
    "moduleId": "m2",
    "order": 3,
    "difficulty": "intermediate",
    "estimatedMinutes": 9,
    "tags": [
      "TTFT",
      "首字时延",
      "Prefill",
      "模型网关",
      "RAG"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "TTFT 是从请求发出到客户端收到第一个输出 Token 的时间。它代表用户是否感到系统“有反应”，但它不是总耗时，也不能单独解释完整体验。",
    "whyItMatters": "在客服、办公助手、代码 Agent 和 MaaS 平台中，TTFT 直接影响用户对系统可用性的第一感受。企业排查 TTFT 时必须把排队、路由、RAG、工具调用、Prefill、缓存命中和网络链路拆开看，避免只把问题归咎于模型。",
    "mentalModel": "TTFT 衡量的不是上菜速度，而是餐厅从点单到上第一道菜的时间。第一道菜快，客人就知道厨房在动；但慢的原因可能是排队、转单、备菜或调度，而不只是厨师炒得慢。",
    "mechanism": [
      "用户请求先经过前端、模型网关、鉴权、限流和路由，这些步骤可能带来排队和控制面耗时。",
      "如果应用使用 RAG 或工具调用，请求在进入模型前还要等待检索、重排、权限过滤或工具结果。",
      "推理服务收到完整上下文后进入 Prefill，输入 Token 越多，首字前计算越重。",
      "若多轮会话命中 KV Cache 或前缀缓存，部分计算可复用；若路由打散，TTFT 可能显著升高。",
      "模型生成第一个输出 Token 并通过流式通道返回，客户端收到这一刻才结束 TTFT 计时。",
      "TTFT 需要和 TPOT、总耗时、错误率、队列长度和缓存命中率一起观察。"
    ],
    "animation": {
      "type": "prefill-decode",
      "title": "TTFT 的端到端时间拆解",
      "steps": [
        {
          "id": "s1",
          "title": "请求进入网关",
          "description": "TTFT 从用户请求开始计时，鉴权、限流、排队和模型路由都会消耗首字前时间。",
          "highlightTargets": [
            "gateway",
            "queue",
            "route"
          ]
        },
        {
          "id": "s2",
          "title": "RAG 与工具前置处理",
          "description": "检索、重排或工具调用在模型前完成，任何一步变慢都会推迟首字。",
          "highlightTargets": [
            "rag",
            "tool-call"
          ]
        },
        {
          "id": "s3",
          "title": "Prefill 处理输入",
          "description": "完整上下文进入 Prefill，输入 Token 和缓存状态决定这一段的计算量。",
          "highlightTargets": [
            "prefill",
            "input-tokens"
          ]
        },
        {
          "id": "s4",
          "title": "首个 Token 返回",
          "description": "第一个输出 Token 沿流式通道返回客户端，TTFT 计时停止。",
          "highlightTargets": [
            "first-token",
            "stream"
          ]
        },
        {
          "id": "s5",
          "title": "拆分瓶颈归因",
          "description": "TTFT 需要按网关、RAG、排队、Prefill 和网络等链路分段归因，不能只看端到端总值。",
          "highlightTargets": [
            "latency-breakdown"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "客服助手首字突然变慢",
      "scenario": "某客服 AI 助手在促销高峰期 TTFT 从 1 秒升到 6 秒，但总输出长度没有明显变化。",
      "problem": "业务方要求更换更快模型，平台团队发现模型 TPOT 仍稳定，但网关排队和检索耗时升高。",
      "analysis": "高峰期请求排队增加，RAG 知识库检索负载变高，同时部分请求被路由到冷实例导致 Prefill 无缓存可复用。",
      "solution": "按链路拆分 TTFT，增加检索缓存和限流策略，优化路由的会话亲和，并为高峰期设置容量预热。",
      "takeaway": "TTFT 是端到端体验指标，不能被简化成“模型速度”。"
    },
    "pitfalls": [
      "只看总耗时，不看首字时延，导致用户体感问题被平均值掩盖。",
      "把 TTFT 全部归因于模型，而忽略网关排队、RAG、工具调用和网络。",
      "只优化前端流式展示，没有缩短服务端首个 Token 产生时间。",
      "在多轮会话中忽略 Session 亲和，使缓存命中率下降后 TTFT 飙升。",
      "用单次离线压测代表线上高峰期，忽略队列和调度。"
    ],
    "diagnosticQuestion": {
      "id": "q-ttft-1",
      "type": "multiple",
      "scenario": "某 MaaS 平台高峰期 TTFT 从 800ms 上升到 4s。TPOT 基本稳定，错误率未升高，但队列长度、RAG 检索耗时和 KV Cache 未命中率都上升。",
      "question": "以下哪些排查方向是合理的？",
      "options": [
        {
          "id": "a",
          "text": "检查网关和推理服务的排队等待"
        },
        {
          "id": "b",
          "text": "检查 RAG 检索和重排链路是否变慢"
        },
        {
          "id": "c",
          "text": "检查会话亲和和 KV Cache 命中是否下降"
        },
        {
          "id": "d",
          "text": "只优化 Decode 阶段 TPOT，因为流式输出速度决定首字时延"
        }
      ],
      "correctOptionIds": [
        "a",
        "b",
        "c"
      ],
      "explanation": "TTFT 是首字前链路指标，受网关排队、模型前处理、Prefill、缓存命中和网络共同影响。题干同时给出队列长度、RAG 检索耗时和 KV Cache 未命中率上升，因此 a/b/c 都是合理排查方向。d 不是最佳判断，因为 TPOT 基本稳定，且 Decode 阶段发生在首字产生之后，只优化 TPOT 不能解释首字前等待增长。",
      "troubleshootingPath": [
        "拆分端到端 TTFT 时间段",
        "检查网关排队、限流和路由日志",
        "检查 RAG 检索耗时和上下文长度",
        "检查 KV Cache 命中率和会话亲和策略"
      ],
      "relatedConceptIds": [
        "prefill",
        "decode",
        "kv-cache",
        "model-gateway",
        "session-affinity"
      ]
    },
    "keyTakeaways": [
      "TTFT 衡量首个 Token 返回时间，代表系统是否有反应。",
      "TTFT 不是总耗时。",
      "RAG、工具、路由和缓存都会影响 TTFT。",
      "诊断 TTFT 必须做链路拆分。"
    ],
    "relatedConceptIds": [
      "token",
      "prefill",
      "decode",
      "kv-cache",
      "model-gateway",
      "session-affinity"
    ]
  },
  {
    "id": "kv-cache",
    "title": "KV Cache",
    "slug": "kv-cache",
    "moduleId": "m2",
    "order": 5,
    "difficulty": "advanced",
    "estimatedMinutes": 12,
    "tags": [
      "KV Cache",
      "TTFT",
      "Session 亲和",
      "显存",
      "MaaS"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "KV Cache 是大模型推理中缓存历史上下文 Key 和 Value 的机制，用于避免生成新 Token 时重复计算全部历史。它是多轮会话性能、显存占用和路由策略之间的关键连接点。",
    "whyItMatters": "企业 MaaS 和 Agent 平台经常处理长会话、多轮任务和高并发请求。在支持会话或前缀缓存复用的推理服务中，KV Cache 命中率会影响 TTFT、吞吐和 GPU 显存压力；如果路由、扩缩容或会话管理不当，用户会看到首字变慢和成本上升。",
    "mentalModel": "从推理服务的视角，KV Cache 是模型读完上下文后留下的一份“分层笔记”。这份笔记还在、且请求正好落到持有它的实例时，后续生成就能少重复读；一旦请求被送到没有笔记的实例，就只能重新读全文。",
    "mechanism": [
      "Prefill 阶段处理完整输入上下文，并在每层注意力中计算 Key 和 Value。",
      "推理服务通常把这些 Key 和 Value 缓存在显存中，作为后续生成可复用的中间状态；是否能跨请求复用取决于具体服务的会话、前缀缓存和路由实现。",
      "Decode 每生成一个新 Token，也会为该 Token 追加新的 KV，缓存随上下文增长而增长。",
      "同一会话后续请求如果被服务端保留并路由到持有缓存的实例，可以减少重复 Prefill，降低 TTFT。",
      "如果会话亲和失效、实例扩缩容或缓存被挤出，请求需要重新 Prefill，首字时延会上升。",
      "长上下文和大量并发会话会占用显存，需要在命中率、容量、隔离和成本之间做权衡。"
    ],
    "animation": {
      "type": "kv-cache",
      "title": "KV Cache 命中与未命中",
      "steps": [
        {
          "id": "s1",
          "title": "多轮请求进入同一会话",
          "description": "多轮请求只有在服务端保留会话状态并能路由到合适实例时，才可能复用已有缓存。",
          "highlightTargets": [
            "session",
            "instance"
          ]
        },
        {
          "id": "s2",
          "title": "Prefill 写入缓存",
          "description": "完整上下文被处理后，Key 和 Value 进入显存缓存区。",
          "highlightTargets": [
            "prefill",
            "kv-write"
          ]
        },
        {
          "id": "s3",
          "title": "Decode 复用缓存",
          "description": "生成新 Token 时直接复用历史 KV，不再重复计算全部上下文。",
          "highlightTargets": [
            "decode",
            "cache-hit"
          ]
        },
        {
          "id": "s4",
          "title": "路由打散导致未命中",
          "description": "下一轮请求被送到另一台实例，缓存区为空，系统必须重新 Prefill。",
          "highlightTargets": [
            "route-miss",
            "cache-miss"
          ]
        },
        {
          "id": "s5",
          "title": "显存容量约束",
          "description": "多个长会话同时占用缓存会挤压显存容量，需要淘汰、压缩、隔离或调度策略。",
          "highlightTargets": [
            "memory",
            "eviction"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "高峰期多轮对话首字飙升",
      "scenario": "某 MaaS 平台承载多个内部 Copilot，高峰期多轮对话首字从 800ms 上升到 4s。",
      "problem": "监控显示 KV Cache 命中率从 60% 降到 15%，但总请求量增长并不极端。",
      "analysis": "自动扩容后负载均衡未保持 Session 亲和，多轮请求被打散到不同实例；部分长会话还挤占显存，导致缓存淘汰更频繁。",
      "solution": "为会话类请求启用 Session 亲和和缓存感知路由，按上下文长度做容量隔离，并把缓存命中率纳入核心 SLO。",
      "takeaway": "KV Cache 不是底层实现细节，而是企业推理平台需要显式治理的性能资产。"
    },
    "pitfalls": [
      "认为增加 GPU 数量一定能降低 TTFT，却没有保证请求命中持有缓存的实例。",
      "只监控显存利用率，不监控 KV Cache 命中率、淘汰率和会话长度分布。",
      "把所有会话放在同一资源池，长上下文任务挤占短问答任务缓存。",
      "忽略扩缩容对缓存热度的影响，高峰期频繁冷启动导致首字变慢。",
      "把缓存视为无限资源，没有设计过期、淘汰和隔离策略。"
    ],
    "diagnosticQuestion": {
      "id": "q-kv-cache-1",
      "type": "single",
      "scenario": "某 MaaS 平台高峰期 TTFT 从 800ms 上升到 4s，KV Cache 命中率从 60% 下降到 15%，用户反馈多轮对话首字明显变慢。",
      "question": "你最优先排查什么？",
      "options": [
        {
          "id": "a",
          "text": "是否应立即增加 GPU 副本数，降低单实例排队"
        },
        {
          "id": "b",
          "text": "是否应优先压缩输出长度，减少 Decode 总耗时"
        },
        {
          "id": "c",
          "text": "是否应扩大上下文窗口，减少多轮会话的信息缺失"
        },
        {
          "id": "d",
          "text": "Session 亲和或缓存感知路由是否失效"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "TTFT 上升且 KV Cache 命中率从 60% 降到 15%，最优先怀疑会话请求没有路由到持有上下文缓存的实例，或扩缩容导致缓存热度丢失。a 是强干扰项：扩容能缓解排队，但若不做缓存感知路由，新增实例可能让请求更难命中已有缓存；b 影响 Decode 总耗时，不解释首字和命中率；c 会增加缓存和 Prefill 压力，方向相反。",
      "troubleshootingPath": [
        "按会话检查连续请求是否落到同一实例",
        "查看扩缩容和负载均衡策略变更",
        "分析缓存淘汰率和长会话显存占用",
        "对比启用会话亲和前后的 TTFT 和命中率"
      ],
      "relatedConceptIds": [
        "prefill",
        "decode",
        "ttft",
        "session-affinity"
      ]
    },
    "keyTakeaways": [
      "KV Cache 缓存历史上下文的 Key 和 Value。",
      "多轮对话性能高度依赖缓存命中，而命中又依赖 Session 亲和。",
      "长上下文会显著占用显存。",
      "缓存指标应进入 MaaS 平台观测面。"
    ],
    "relatedConceptIds": [
      "prefill",
      "decode",
      "ttft",
      "session-affinity",
      "context-window",
      "sla"
    ]
  },
  {
    "id": "model-gateway",
    "title": "模型网关",
    "slug": "model-gateway",
    "moduleId": "m3",
    "order": 2,
    "difficulty": "intermediate",
    "estimatedMinutes": 10,
    "tags": [
      "模型网关",
      "MaaS",
      "鉴权",
      "限流",
      "审计",
      "Observability"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "模型网关是企业业务访问模型能力的统一入口，负责把分散的模型调用变成可治理、可观测、可计量的服务。它不是简单 API 转发层，而是企业 AI 平台的控制面之一。",
    "whyItMatters": "没有模型网关，企业很难统一鉴权、路由、限流、成本计量、审计和故障隔离。业务接入越多，模型网关越决定平台能否稳定扩展、合规运行并形成治理闭环。",
    "mentalModel": "从平台负责人的视角，模型网关更像机场塔台而不是一根网线：飞机不能各飞各的，塔台要先确认身份、分配航线、控制流量、记录轨迹，并在异常时改道。模型请求也需要这样一个统一协调和留痕的控制点。",
    "mechanism": [
      "业务应用把模型请求发送到统一网关，而不是直接调用某个模型供应方或推理实例。",
      "网关执行应用身份识别、权限校验、配额检查和敏感策略判断，决定请求是否允许进入。",
      "网关根据模型能力、成本、时延、地域、SLA 和故障状态选择目标模型或服务池。",
      "请求执行过程中，网关记录输入/输出 Token、耗时、错误、调用方、模型版本和 trace id。",
      "当下游模型拥塞或异常时，网关可以限流、熔断、降级、重试或切换备用模型。",
      "这些数据回流到成本治理、质量评测、审计和容量规划，形成企业 AI 平台闭环。"
    ],
    "animation": {
      "type": "model-router",
      "title": "模型网关从入口到治理闭环",
      "steps": [
        {
          "id": "s1",
          "title": "业务请求进入统一入口",
          "description": "多个业务应用请求汇聚到模型网关，平台可以在统一入口执行治理策略。",
          "highlightTargets": [
            "apps",
            "gateway"
          ]
        },
        {
          "id": "s2",
          "title": "鉴权与配额检查",
          "description": "网关检查应用身份、权限、额度和安全策略，不合规请求被拦截。",
          "highlightTargets": [
            "auth",
            "quota",
            "policy"
          ]
        },
        {
          "id": "s3",
          "title": "选择模型与服务池",
          "description": "根据任务类型、成本、时延和可用性，把请求路由到合适模型。",
          "highlightTargets": [
            "router",
            "models"
          ]
        },
        {
          "id": "s4",
          "title": "记录计量与 Trace",
          "description": "网关记录 Token、耗时、模型版本和 trace id，为审计与观测提供证据。",
          "highlightTargets": [
            "metering",
            "trace"
          ]
        },
        {
          "id": "s5",
          "title": "异常时降级或熔断",
          "description": "下游模型异常时，网关触发限流、熔断或备用模型路由，保护整体稳定性。",
          "highlightTargets": [
            "fallback",
            "circuit-break"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "多个业务绕过平台直连模型",
      "scenario": "某集团 20 个生产应用接入模型能力，其中 8 个仍直连 3 家外部模型 API。季度安全审计抽样发现约 40% 请求缺少统一 trace，2 起敏感字段外发事件无法还原完整调用链。",
      "problem": "安全团队无法确认哪些系统、哪些用户、哪些模型版本处理过敏感数据；平台团队也无法统一限流、配额和成本预算。",
      "analysis": "缺少模型网关导致调用路径分散。团队曾先要求业务 SDK 自行埋点，但既有直连路径没有被阻断，日志字段不一致，异常时也无法在请求进入模型前执行策略。",
      "solution": "建立统一模型网关，要求生产应用分批迁入网关；迁移期冻结新增直连凭证，网关统一记录应用身份、权限、Token、模型版本、错误和 trace，并对例外调用设置到期收口清单。",
      "takeaway": "模型网关的关键价值不是代理 URL，而是把模型调用变成可执行策略、可审计证据和可回放治理链路。"
    },
    "pitfalls": [
      "把模型网关做成薄转发层，只代理 URL 或只做鉴权，不承担 Token 计量、错误分类和模型版本记录等治理观测责任。",
      "允许业务长期保留直连模型的旁路，导致成本和审计数据不完整。",
      "把路由策略写死在业务代码里，使模型切换和故障降级成本很高。",
      "网关缺少压测和限流设计，高峰期反而成为单点瓶颈。"
    ],
    "diagnosticQuestion": {
      "id": "q-model-gateway-1",
      "type": "single",
      "scenario": "一家企业有 20 个应用接入模型能力，其中 8 个直连外部 API。最近安全审计要求追踪敏感数据调用链，但平台只能拿到部分请求日志。",
      "question": "最优先的工程改造是什么？",
      "options": [
        {
          "id": "a",
          "text": "要求所有生产调用统一经过模型网关，并记录鉴权、计量和 trace 信息"
        },
        {
          "id": "b",
          "text": "先要求各业务 SDK 统一埋点并冻结新增直连调用，但暂时保留既有直连路径"
        },
        {
          "id": "c",
          "text": "只把涉及敏感数据的 8 个应用迁入网关，其他应用继续按原路径调用"
        },
        {
          "id": "d",
          "text": "把所有模型切到同一供应商，减少审计字段差异"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "安全审计要求追踪敏感数据调用链，第一步必须让生产模型调用进入统一控制面，并在网关记录应用身份、鉴权、Token、模型版本、错误和 trace。b 是强干扰项：SDK 埋点和冻结新增旁路可作为迁移期措施，但既有直连仍会造成日志缺口和策略绕过；c 只迁移部分应用会继续留下审计盲区；d 降低字段差异，却不能解决调用入口分散和策略执行缺失。",
      "troubleshootingPath": [
        "盘点所有模型调用入口、凭证和供应商",
        "阻断或迁移生产旁路调用",
        "在网关记录应用、模型、Token、错误和 trace id",
        "建立配额、审计和异常告警策略",
        "设置迁移期例外清单和到期收口机制"
      ],
      "relatedConceptIds": [
        "maas",
        "multi-model-routing",
        "rate-limit-circuit-break",
        "observability"
      ]
    },
    "keyTakeaways": [
      "模型网关是业务访问模型的统一入口。",
      "它承担鉴权、路由、限流、计量、审计和观测。",
      "它不是简单 API 转发。",
      "企业治理应在请求进入模型前生效。",
      "直连旁路会破坏成本和安全闭环。"
    ],
    "relatedConceptIds": [
      "maas",
      "multi-model-routing",
      "cost-routing",
      "capability-routing",
      "rate-limit-circuit-break",
      "observability"
    ]
  },
  {
    "id": "multi-model-routing",
    "title": "多模型路由",
    "slug": "multi-model-routing",
    "moduleId": "m3",
    "order": 3,
    "difficulty": "advanced",
    "estimatedMinutes": 11,
    "tags": [
      "多模型路由",
      "MaaS",
      "成本路由",
      "能力路由",
      "Eval",
      "SLA"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "多模型路由是根据任务、成本、时延、能力和稳定性，把请求动态分配给合适模型的机制。它的目标不是永远选择最强模型，而是在业务约束下选择最合适的模型。",
    "whyItMatters": "企业 AI 平台通常同时面对内部模型、外部模型、专用模型和不同规格的推理服务。在满足质量门槛的前提下，多模型路由可以降低成本、提升 SLA、隔离风险，并让模型选择从人工经验变成基于评测和观测的策略闭环。",
    "mentalModel": "多模型路由解决的不是“哪个模型最强”，而是“这一单派给谁最合适”。简单工单不必派最资深专家，紧急工单要看响应时间，合规工单要派内部人员；模型选择同样要按任务特征和约束派单。",
    "mechanism": [
      "网关接收请求后识别任务类型、输入长度、敏感等级、质量要求和时延预算。",
      "路由策略读取候选模型的能力评测、成本、当前负载、错误率、地域和合规属性。",
      "系统先用质量门槛过滤候选模型，淘汰达不到该任务最低要求的模型。",
      "在通过门槛的模型中比较成本、时延和稳定性择优；被选模型能力不足或异常时，切换到更强或外部模型补位。",
      "请求执行后记录模型版本、输入输出、用户反馈、错误和成本，为策略回放提供数据。",
      "评测集和线上观测持续更新路由规则，避免策略长期停留在人工拍脑袋阶段。",
      "在关键业务中，路由还要支持灰度、熔断、回退和人工审批，防止模型切换造成质量回归。"
    ],
    "animation": {
      "type": "model-router",
      "title": "按能力、成本和时延选择模型",
      "steps": [
        {
          "id": "s1",
          "title": "请求带着任务约束进入",
          "description": "路由策略读取任务类型、敏感级别、时延预算和质量要求，形成模型选择约束。",
          "highlightTargets": [
            "request-labels"
          ]
        },
        {
          "id": "s2",
          "title": "读取模型画像",
          "description": "候选模型需要有能力、成本、延迟和稳定性画像，路由判断不能只依赖人工印象。",
          "highlightTargets": [
            "model-profiles"
          ]
        },
        {
          "id": "s3",
          "title": "匹配最合适模型",
          "description": "路由器先过滤不满足质量门槛的模型，再选择成本、时延和稳定性更合适的目标。",
          "highlightTargets": [
            "router",
            "selected-model"
          ]
        },
        {
          "id": "s4",
          "title": "异常时补位",
          "description": "被选模型错误率升高或延迟超出预算时，请求切到备用模型或更高能力模型。",
          "highlightTargets": [
            "fallback",
            "sla"
          ]
        },
        {
          "id": "s5",
          "title": "观测回流策略",
          "description": "线上质量、成本、延迟和错误数据回到评测与策略配置，用于修正后续路由决策。",
          "highlightTargets": [
            "eval",
            "observability",
            "policy"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "全部请求走旗舰模型导致成本过高",
      "scenario": "某企业办公助手每月约 120 万次请求，摘要、翻译、制度问答和代码解释全部路由到同一个高能力模型，月度模型成本连续两个月增长超过 65%。",
      "problem": "平台希望把 70% 请求切到便宜模型，但没有任务分型、离线评测集和分任务失败率统计，只能看总投诉率。",
      "analysis": "团队最初准备按固定比例灰度降级，后来回放 1 万条历史请求发现：摘要和翻译任务在中等模型上通过率接近旗舰模型，但制度问答和代码解释的失败重试率明显更高。只看平均投诉率会掩盖高风险任务。",
      "solution": "建立任务分类、模型能力评测和成本基线；简单任务优先内部或低成本模型，复杂任务和失败重试再升级到高能力模型，并为每类任务设置灰度、回退和质量门槛。",
      "takeaway": "多模型路由不能先从便宜模型比例开始，而要先知道哪些任务在什么质量门槛下可以安全降级。"
    },
    "pitfalls": [
      "把多模型路由简化成随机分流或固定比例灰度，没有任务语义和质量门槛。",
      "只按价格选模型，忽略失败重试和人工返工带来的隐性成本。",
      "只按能力选最大模型，导致大量简单任务过度消费。",
      "没有评测集和观测回流，路由策略无法证明是否有效。",
      "内部模型优先策略没有合规例外和外部补位机制，影响关键业务可用性。"
    ],
    "diagnosticQuestion": {
      "id": "q-multi-model-routing-1",
      "type": "single",
      "scenario": "某 MaaS 平台希望降低成本，准备把 70% 请求切到便宜模型。但当前没有任务分类、质量评测集，也没有线上失败率分任务统计。",
      "question": "你应先补齐哪项能力？",
      "options": [
        {
          "id": "a",
          "text": "先挑历史投诉较少的摘要和翻译请求做 5% 便宜模型灰度，用投诉率兜底"
        },
        {
          "id": "b",
          "text": "建立任务分型、评测基线和观测回流，再制定路由策略"
        },
        {
          "id": "c",
          "text": "优先按模型单价排序，确保每类任务默认走最低价模型"
        },
        {
          "id": "d",
          "text": "只保留一个高能力模型，先消除多模型带来的策略复杂度"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "多模型路由必须基于任务、质量、成本和稳定性数据。a 是强干扰项：小流量灰度本身合理，但题干明确缺少任务分类、质量评测集和分任务失败率统计，只用投诉率兜底会漏掉低频高风险质量退化；c 只看单价会放大失败重试和人工返工成本；d 简化了策略，却放弃了成本和 SLA 优化空间。第一步应补齐任务分型、评测基线和观测回流。",
      "troubleshootingPath": [
        "按业务场景拆分任务类型",
        "建立每类任务的质量评测集和最低门槛",
        "采集模型版本、成本、错误、延迟和用户反馈",
        "为路由策略设置灰度、回退和人工审批条件",
        "回放历史流量验证策略收益与质量风险"
      ],
      "relatedConceptIds": [
        "model-gateway",
        "cost-routing",
        "capability-routing",
        "eval",
        "sla"
      ]
    },
    "keyTakeaways": [
      "不同任务应走不同模型。",
      "路由要平衡能力、成本、时延和稳定性。",
      "内部模型优先不等于禁止外部补位。",
      "路由策略必须由评测和观测驱动。",
      "灰度和回退是生产路由的基本能力。"
    ],
    "relatedConceptIds": [
      "model-gateway",
      "cost-routing",
      "capability-routing",
      "sla",
      "eval",
      "observability"
    ]
  },
  {
    "id": "context-window",
    "title": "上下文窗口",
    "slug": "context-window",
    "moduleId": "m4",
    "order": 3,
    "difficulty": "basic",
    "estimatedMinutes": 9,
    "tags": [
      "上下文窗口",
      "Context",
      "长上下文",
      "Agent",
      "RAG"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "上下文窗口是模型在一次推理中能够看到的 Token 范围。它不是长期记忆，窗口之外的信息不会被当前请求直接使用。",
    "whyItMatters": "企业 Agent 往往要处理文档、历史会话、工具结果和仓库上下文。窗口管理决定模型能否看到关键证据，也决定成本、TTFT、注意力干扰和任务稳定性。",
    "mentalModel": "上下文窗口就是模型当前能摊开在桌面上的那叠资料——桌面再大也有边界，摊上去的每份材料都会影响判断。真正的工程能力不是把所有材料都堆上桌，而是选择、压缩和排序出最该被看到的那几份。",
    "mechanism": [
      "应用在请求前组装系统提示词、用户目标、历史消息、检索片段、工具结果和中间状态。",
      "这些内容被转换为 Token，并共同占用模型的上下文窗口预算。",
      "如果总 Token 超过窗口限制，系统必须截断、压缩、摘要或重新选择上下文，否则请求会失败或丢失信息。",
      "长上下文会增加 Prefill 成本和 KV Cache 占用，也可能让注意力被无关内容稀释。",
      "Agent 需要持续决定哪些信息保留在窗口内，哪些转为记忆、摘要或外部状态。",
      "上下文策略应通过任务成功率、引用准确性、TTFT 和 Token 成本共同评估。"
    ],
    "animation": {
      "type": "context-window",
      "title": "窗口内外的信息选择",
      "steps": [
        {
          "id": "s1",
          "title": "资料进入候选池",
          "description": "用户目标、历史会话、RAG 片段和工具结果进入候选区，但尚未全部放进窗口。",
          "highlightTargets": [
            "candidate-context"
          ]
        },
        {
          "id": "s2",
          "title": "窗口容量有限",
          "description": "模型只能直接使用窗口内的 Token；窗口外的信息即使存在于外部系统，也不会自动参与当前推理。",
          "highlightTargets": [
            "window-limit"
          ]
        },
        {
          "id": "s3",
          "title": "选择与排序",
          "description": "高相关、最新、权威的信息被放入窗口前部，低相关材料被移出或降权。",
          "highlightTargets": [
            "selection",
            "ranking"
          ]
        },
        {
          "id": "s4",
          "title": "压缩历史信息",
          "description": "长历史会话被压缩成摘要，释放窗口空间给当前任务证据。",
          "highlightTargets": [
            "compression",
            "summary"
          ]
        },
        {
          "id": "s5",
          "title": "窗口影响成本和质量",
          "description": "窗口变长时成本和 TTFT 上升；窗口更干净时答案依据更集中。",
          "highlightTargets": [
            "cost",
            "ttft",
            "quality"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "代码 Agent 忘记关键约束",
      "scenario": "某代码 Agent 修复缺陷时，用户在会话早期强调不能改公共接口，但后续多轮工具输出很长。",
      "problem": "最终补丁修改了公共接口，违反架构约束。",
      "analysis": "关键约束被大量日志、搜索结果和 diff 挤出或稀释，Agent 没有把不可破坏约束提升为稳定上下文。",
      "solution": "把硬约束放入高优先级上下文区，对工具结果做摘要和筛选，并在行动前加入约束复核步骤。",
      "takeaway": "Agent 的上下文窗口管理不是容量问题，而是任务状态和约束治理问题。"
    },
    "pitfalls": [
      "把大窗口当作长期记忆，忽略每次请求仍然只看窗口内内容。",
      "把所有检索结果和工具日志原样塞入上下文，导致成本和干扰上升。",
      "只按时间保留最近消息，丢掉早期但关键的业务约束。",
      "没有区分目标、证据、历史、工具结果和不可破坏规则的优先级。",
      "上下文压缩只追求变短，没有验证压缩后是否保留关键事实。"
    ],
    "diagnosticQuestion": {
      "id": "q-context-window-1",
      "type": "single",
      "scenario": "一个 Issue Fix Agent 在长会话后开始忽略最初的“不要改公共 API”要求。日志显示工具输出和搜索结果累计很长，系统按最近消息截断上下文。",
      "question": "最应该优先改进哪项机制？",
      "options": [
        {
          "id": "a",
          "text": "只把模型温度调低，减少它偏离用户原始要求的概率"
        },
        {
          "id": "b",
          "text": "扩大可检索仓库范围，让 Agent 每轮能拿到更多搜索结果"
        },
        {
          "id": "c",
          "text": "把工具日志压缩成摘要，但不区分硬约束和普通观察结果"
        },
        {
          "id": "d",
          "text": "建立上下文选择与约束保留机制，把硬约束固定在高优先级上下文中"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "问题不是模型不知道规则，而是关键约束在长会话中被截断或稀释。a 只能减少随机性，不能保证窗口里保留硬约束；b 会引入更多上下文竞争，可能进一步挤压关键规则；c 是强干扰项，摘要确实能减小上下文，但如果不提升硬约束优先级，摘要后仍可能丢掉“不要改公共 API”这类不可破坏条件。第一步应建立上下文选择、排序和约束保留机制。",
      "troubleshootingPath": [
        "检查请求实际携带的上下文内容",
        "确认硬约束是否被截断或排在低优先级位置",
        "压缩工具输出并保留关键结论",
        "把不可破坏规则固定到高优先级上下文",
        "在行动前加入约束核对"
      ],
      "relatedConceptIds": [
        "context-compression",
        "context-pollution",
        "agent-loop",
        "issue-fix-agent"
      ]
    },
    "keyTakeaways": [
      "模型只能看到窗口内信息。",
      "长上下文不等于长期记忆。",
      "大窗口会增加成本、TTFT 和干扰。",
      "Agent 需要上下文选择、压缩和排序。",
      "关键约束应被稳定保留。"
    ],
    "relatedConceptIds": [
      "token",
      "attention",
      "prefill",
      "context-compression",
      "context-pollution",
      "agent-loop"
    ]
  },
  {
    "id": "agent-loop",
    "title": "Agent Loop",
    "slug": "agent-loop",
    "moduleId": "m4",
    "order": 10,
    "difficulty": "intermediate",
    "estimatedMinutes": 12,
    "tags": [
      "Agent Loop",
      "工具调用",
      "状态管理",
      "Human-in-the-loop",
      "Trace"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "Agent Loop 是 Agent 围绕目标反复执行观察、计划、行动、校验并决定继续或停止的任务循环。Agent 不是一次模型回答，而是带状态、工具和退出条件的执行系统。",
    "whyItMatters": "企业 Agent 往往要修改代码、处理工单、查询系统或编排流程，失败点不只在模型回答质量。Loop 的可追踪、可回滚、可审批和可终止能力，决定 Agent 是否能进入生产工作流。",
    "mentalModel": "观察 Agent Loop 转一圈，很像看一名工程师处理任务：先看现场，再定下一步，执行一个动作，检查结果，然后决定继续、返工还是请人确认。差别在于，企业需要把这套节奏记录成可审计、可停止的机器流程。",
    "mechanism": [
      "Agent 接收目标、约束和可用工具，建立初始任务状态。",
      "Observe 阶段读取上下文、文件、日志、工单或工具返回，了解当前状态。",
      "Plan 阶段基于目标和观察选择下一步动作，必要时形成短计划或假设；有些系统会把这一步称为 Think，但工程上更关注它是否可执行、可验证。",
      "Act 阶段调用工具或执行操作，例如搜索代码、运行测试、修改草稿或创建评论。",
      "Check 阶段验证动作结果是否满足目标，记录错误、证据和剩余风险。",
      "Loop 根据退出条件决定继续、停止、回滚或转人工审批，避免无界循环和不可控修改。"
    ],
    "animation": {
      "type": "agent-loop",
      "title": "Observe → Plan → Act → Check → Continue/Stop",
      "steps": [
        {
          "id": "s1",
          "title": "用户给出目标",
          "description": "Agent 收到一个需要完成的任务，并加载本轮执行必须遵守的约束、权限和可用工具。",
          "highlightTargets": [
            "goal",
            "constraints",
            "tools"
          ]
        },
        {
          "id": "s2",
          "title": "Observe 观察",
          "description": "Agent 读取上下文、日志或代码，形成当前状态视图。",
          "highlightTargets": [
            "observe",
            "context"
          ]
        },
        {
          "id": "s3",
          "title": "Plan 选择下一步",
          "description": "Agent 基于观察选择一个可验证动作，而不是一次性假设所有答案。",
          "highlightTargets": [
            "plan"
          ]
        },
        {
          "id": "s4",
          "title": "Act 调用工具",
          "description": "Agent 调用工具执行动作，工具返回结构化结果或错误。",
          "highlightTargets": [
            "act",
            "tool-result"
          ]
        },
        {
          "id": "s5",
          "title": "Check 校验结果",
          "description": "Agent 检查目标是否达成、是否引入风险，并记录证据。",
          "highlightTargets": [
            "check",
            "evidence"
          ]
        },
        {
          "id": "s6",
          "title": "继续、停止或转人工",
          "description": "未完成则继续循环；达成目标则停止；高风险动作进入人工审批。",
          "highlightTargets": [
            "continue",
            "stop",
            "human-review"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "自动运维 Agent 陷入重复重启",
      "scenario": "某企业试点运维 Agent 处理夜间告警。一次缓存服务异常中，Agent 在 12 分钟内连续重启同一服务 3 次，错误率仍保持在 18% 以上。",
      "problem": "Agent 只有工具调用能力，没有明确校验标准、重试上限和升级人工的条件；事后日志只记录了最终动作，没有每轮观察、判断和失败原因。",
      "analysis": "Loop 缺少 Check 和 Stop 设计，导致它把“执行过动作”误当成“问题在推进”。重启动作本身合理，但在指标未恢复、根因未变化时继续重试就会扩大风险。",
      "solution": "为每类动作定义成功判据、最大重试次数、回滚策略和人工审批点；所有观察、动作、结果和继续条件写入 trace，连续失败后转人工并附带证据。",
      "takeaway": "Agent 的关键不是能调用工具，而是能在循环中被约束、验证、停止并接受人审。"
    },
    "pitfalls": [
      "把 Agent 等同于一次 Prompt 回答，没有任务状态和循环控制。",
      "只关注工具数量，不定义每个工具调用后的校验标准。",
      "缺少退出条件，导致 Agent 重复尝试、扩大修改或消耗大量 Token。",
      "高风险动作没有人工审批和回滚方案，难以进入企业生产流程。",
      "没有 trace，事后无法解释 Agent 为什么做出某个动作。"
    ],
    "diagnosticQuestion": {
      "id": "q-agent-loop-1",
      "type": "single",
      "scenario": "一个代码 Agent 在修复测试失败时连续修改 6 个无关文件，测试仍未通过。日志只记录了最终 diff，没有记录每次工具调用、失败原因和继续条件。",
      "question": "最优先补齐哪类能力？",
      "options": [
        {
          "id": "a",
          "text": "增加代码搜索和编辑工具权限，让 Agent 能覆盖更多可能根因"
        },
        {
          "id": "b",
          "text": "补齐 Loop 的校验、退出条件、trace 和人工审批机制"
        },
        {
          "id": "c",
          "text": "要求 Agent 每轮先输出更详细计划，但不限制修改范围和重试次数"
        },
        {
          "id": "d",
          "text": "把测试失败日志和历史修改记录完整放入上下文，减少 Agent 漏看信息"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "题干核心风险是 Agent 连续修改无关文件、缺少每轮工具调用记录、失败原因和继续条件，说明 Loop 不可控、不可追踪。a 会扩大权限和影响面，不应作为第一步；c 能改善表达，但没有修改范围和重试限制仍可能继续失控；d 是强干扰项，更多日志能改善观察质量，但如果没有校验、退出、trace 和人工审批，Agent 仍无法证明每轮动作是否应继续。第一步应补齐 Loop 控制面。",
      "troubleshootingPath": [
        "还原每轮观察、动作、结果和判断依据",
        "定义测试失败修复的成功判据",
        "设置最大修改范围和重试次数",
        "记录工具调用、失败原因和继续条件",
        "对跨模块修改加入人工审批"
      ],
      "relatedConceptIds": [
        "tool-calling",
        "trace",
        "human-in-the-loop",
        "issue-fix-agent"
      ]
    },
    "keyTakeaways": [
      "Agent 是循环执行系统，不是一次回答。",
      "Loop 包括观察、计划、行动、校验和停止判断。",
      "工具调用必须有状态和验证。",
      "企业 Agent 必须可追踪、可回滚、可审批。",
      "退出条件和人工介入同样重要。"
    ],
    "relatedConceptIds": [
      "context-window",
      "tool-calling",
      "skill",
      "subagent",
      "human-in-the-loop",
      "trace"
    ]
  },
  {
    "id": "skill",
    "title": "Skill",
    "slug": "skill",
    "moduleId": "m4",
    "order": 12,
    "difficulty": "advanced",
    "estimatedMinutes": 12,
    "tags": [
      "Skill",
      "Agent",
      "能力复用",
      "生命周期治理",
      "AI 原生软件工程"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "Skill 是可复用的任务能力单元，通常包含指令、资源、脚本、触发条件和操作步骤。它不是普通提示词模板，也不等同于所有平台通用插件，而是把重复任务沉淀成可治理、可演进的 Agent 能力资产。",
    "whyItMatters": "企业 Agent 想从个人试用走向团队规模化，不能依赖每个用户临时写 Prompt。Skill 能把最佳实践、工具约束、质量门禁和业务知识固化下来，形成可复用、可审核、可版本化的能力库。",
    "mentalModel": "Skill 更接近企业里的标准作业程序配上工具包，而不是一段更长的提示词：新人照着 SOP 做事，既有步骤也有模板和检查项；Agent 调用 Skill 时，同样是加载一组任务指令和资源来稳定完成某类工作。",
    "mechanism": [
      "团队识别高频、边界清晰且可验证的任务，例如 PR 复盘、CI 失败定位或安全检查。",
      "Skill 定义触发场景、输入要求、执行步骤、可用资源、工具约束和输出格式；具体可包含哪些资源或脚本，需要服从所在平台的权限模型。",
      "Agent 在匹配任务时加载对应 Skill，把其中的指令和资源纳入上下文或执行流程。",
      "执行过程中，Skill 引导 Agent 调用工具、收集证据、生成产物并完成自检。",
      "使用结果通过评测、人工反馈和线上 trace 回流，推动 Skill 版本迭代。",
      "企业需要管理 Skill 的所有权、适用范围、权限边界、版本变更、弃用策略和质量指标。"
    ],
    "animation": {
      "type": "skill-lifecycle",
      "title": "从一次经验到可复用的 Skill",
      "steps": [
        {
          "id": "s1",
          "title": "识别高频任务并匹配",
          "description": "团队识别边界清晰、可验证的高频任务；Agent 在匹配到这类任务时才加载对应 Skill，而不是每次临时拼提示词。",
          "highlightTargets": [
            "task",
            "discover"
          ]
        },
        {
          "id": "s2",
          "title": "加载 Skill 的指令与资源",
          "description": "Skill 把触发条件、指令、资源、脚本和约束作为结构化整体加载进来，这正是它区别于一段更长提示词的地方。",
          "highlightTargets": [
            "skill-def",
            "resources"
          ]
        },
        {
          "id": "s3",
          "title": "执行与自检",
          "description": "Skill 引导 Agent 调用工具、收集证据、产出结果并完成自检，让一类任务的做法稳定可重复。",
          "highlightTargets": [
            "execute",
            "tools",
            "self-check"
          ]
        },
        {
          "id": "s4",
          "title": "结果反馈回流",
          "description": "执行结果经评测、人工反馈和线上 trace 回流，暴露 Skill 的不足与改进点。",
          "highlightTargets": [
            "result",
            "feedback",
            "trace"
          ]
        },
        {
          "id": "s5",
          "title": "沉淀为版本化资产",
          "description": "可复用经验沉淀进 Skill 库并记录版本，使能力可追踪、可回滚、可演进。",
          "highlightTargets": [
            "deposit",
            "version"
          ]
        },
        {
          "id": "s6",
          "title": "所有权与权限治理",
          "description": "企业为 Skill 设定 Owner、适用范围、权限边界和弃用策略，避免能力库膨胀失控。",
          "highlightTargets": [
            "governance",
            "permission"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "团队把 CI 修复经验沉淀为 Skill",
      "scenario": "某研发平台每周约 80 次 CI 失败需要 Agent 协助定位。试点初期，Agent 会话平均需要 3 轮人工提醒才能找到正确日志入口，重复漏掉“禁止跳过测试”的评审要求。",
      "problem": "不同 Agent 会话产出不稳定，修复路径不可复用，人工评审反复指出同类问题，CI 修复 PR 的退回率维持在 30% 左右。",
      "analysis": "团队把经验停留在个体提示词和聊天记录中，没有沉淀为结构化、可版本化的任务能力。最初只把提示词写得更严格，但没有日志定位步骤、失败分类、验证命令和输出证据要求。",
      "solution": "创建 CI Fix Skill，明确触发条件、Owner、日志定位步骤、常见失败分类、禁止跳过测试规则、修复后验证命令和 PR 汇报模板；每次评审退回原因进入 Skill 版本记录和评测样例。",
      "takeaway": "Skill 能把一次成功经验变成组织可复用的 Agent 能力，但前提是它包含步骤、资源、约束、证据和版本治理，而不是一段泛泛提示词。"
    },
    "pitfalls": [
      "把 Skill 写成一段泛泛 Prompt，没有资源、步骤、约束和验收标准。",
      "任何任务都做成 Skill，导致能力库膨胀且难以维护。",
      "没有版本管理，Skill 更新后无法追踪质量变化或回滚。",
      "Skill 中包含高权限操作但没有审批和审计边界。",
      "只看使用次数，不看任务成功率、返工率和人工审核意见。"
    ],
    "diagnosticQuestion": {
      "id": "q-skill-1",
      "type": "single",
      "scenario": "某团队为代码审查 Agent 写了一个“请认真审查代码”的 Skill。上线后审查结果仍然飘忽，常漏掉测试缺失和权限风险。",
      "question": "最应如何改进这个 Skill？",
      "options": [
        {
          "id": "a",
          "text": "只把审查提示词改得更严格，要求 Agent 必须指出更多问题"
        },
        {
          "id": "b",
          "text": "把全部代码规范、安全规范和历史评审意见都注入上下文，尽量减少遗漏"
        },
        {
          "id": "c",
          "text": "补充明确触发场景、审查步骤、风险清单、证据要求和输出格式"
        },
        {
          "id": "d",
          "text": "为 Skill 增加更多可调用工具，并允许 Agent 自行决定每个工具的使用边界"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "Skill 不是“更严格的提示词”，而是可复用的任务能力单元。a 只提高口号强度，不能稳定审查路径；b 是强干扰项，更多规范可能提供依据，但不经过筛选会挤占上下文并增加噪声；d 也看似增强能力，但工具越多越需要边界和证据要求，否则风险更难治理。第一步应把触发场景、步骤、风险清单、证据要求和输出格式固化为可执行结构。",
      "troubleshootingPath": [
        "梳理代码审查的高频风险类型",
        "定义 Skill 的输入、步骤、禁止项和输出格式",
        "为关键风险补充证据要求和示例",
        "建立评测样例和人工反馈标签",
        "按版本跟踪漏报率和误报率"
      ],
      "relatedConceptIds": [
        "agent-loop",
        "tool-calling",
        "eval",
        "human-in-the-loop"
      ]
    },
    "keyTakeaways": [
      "Skill 是可复用任务能力，不是普通提示词。",
      "Skill 可以包含指令、资源、脚本、触发条件和步骤。",
      "企业需要治理 Skill 的版本、权限和效果。",
      "高频且可验证的任务最适合沉淀 Skill。",
      "Skill 质量要靠评测和反馈闭环改进。"
    ],
    "relatedConceptIds": [
      "agent-loop",
      "tool-calling",
      "subagent",
      "human-in-the-loop",
      "eval",
      "ai-native-org"
    ]
  },
  {
    "id": "issue-fix-agent",
    "title": "Issue Fix Agent",
    "slug": "issue-fix-agent",
    "moduleId": "m5",
    "order": 2,
    "difficulty": "advanced",
    "estimatedMinutes": 12,
    "tags": [
      "Issue Fix Agent",
      "AI 原生软件工程",
      "测试",
      "PR",
      "质量回流"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "Issue Fix Agent 是围绕问题单完成理解、定位、修改、验证、提交和人审协作的软件工程 Agent。它不是简单“让 AI 改代码”，而是把修复任务纳入可追踪的工程闭环。",
    "whyItMatters": "企业软件工程中的缺陷修复涉及需求理解、上下文检索、代码所有权、测试、回归风险和评审责任。Issue Fix Agent 能提升修复效率，但前提是问题单质量、仓库上下文、测试门禁和人审流程足够清晰。",
    "mentalModel": "与其把 Issue Fix Agent 看成“会改代码的 AI”，不如把它看成一名默认受限执行的工程师助手：它能读工单、查代码、跑测试、提补丁，但要在清楚的问题描述、修改边界、验证标准和资深评审下工作。",
    "mechanism": [
      "Agent 读取问题单，提取现象、复现步骤、期望行为、影响范围和约束条件。",
      "Agent 规范化任务，判断是否信息不足、是否需要澄清、是否属于可自动修复范围。",
      "Agent 检索仓库上下文，定位相关模块、近期变更、测试和代码所有权信息。",
      "Agent 制定最小修改方案，按权限和约束编辑代码或配置，并避免无关重构。",
      "Agent 运行相关测试、类型检查或复现脚本，记录通过与失败证据。",
      "Agent 生成 PR 或修复说明，交给人工评审；评审意见和失败模式回流到问题单模板、Skill 和评测集。"
    ],
    "animation": {
      "type": "issue-fix-flow",
      "title": "从问题单到 PR 的修复闭环",
      "steps": [
        {
          "id": "s1",
          "title": "理解问题单",
          "description": "Issue 中的现象、复现步骤、期望行为和约束需要先被结构化提取。",
          "highlightTargets": [
            "issue",
            "requirements"
          ]
        },
        {
          "id": "s2",
          "title": "定位相关上下文",
          "description": "Agent 搜索代码、测试和历史变更，缩小修改范围。",
          "highlightTargets": [
            "repo-context",
            "search"
          ]
        },
        {
          "id": "s3",
          "title": "最小化修改",
          "description": "补丁只落在相关文件，避免顺手重构和扩大影响面。",
          "highlightTargets": [
            "patch",
            "scope"
          ]
        },
        {
          "id": "s4",
          "title": "验证与失败处理",
          "description": "Agent 运行测试和类型检查；失败时回到定位或修改步骤，而不是盲目继续扩散修改。",
          "highlightTargets": [
            "tests",
            "validation"
          ]
        },
        {
          "id": "s5",
          "title": "提交 PR 与人审",
          "description": "Agent 输出修复摘要、验证证据和剩余风险，进入人工评审。",
          "highlightTargets": [
            "pr",
            "human-review"
          ]
        },
        {
          "id": "s6",
          "title": "质量回流",
          "description": "评审意见、测试失败和问题单缺陷回流到模板、Skill 和评测集。",
          "highlightTargets": [
            "feedback",
            "eval",
            "skill"
          ]
        }
      ]
    },
    "enterpriseCase": {
      "title": "问题单质量差导致修复失败",
      "scenario": "某研发组织试点 Issue Fix Agent，希望自动处理低风险缺陷。",
      "problem": "Agent 经常修改错误模块或提交无法复现的补丁，人工评审退回率很高。",
      "analysis": "许多 Issue 只有一句“页面偶现报错”，缺少复现步骤、期望行为、日志和影响范围。Agent 在信息不足时没有停下来澄清，而是过早进入修改。",
      "solution": "建立问题单模板和准入门槛，要求复现步骤、日志、期望行为和测试建议；Agent 对信息不足的问题先生成澄清问题，不直接改代码。",
      "takeaway": "Issue Fix Agent 的上限不只取决于模型能力，也取决于问题单和工程流程质量。"
    },
    "pitfalls": [
      "把 Issue Fix Agent 当成自动改代码按钮，忽略问题理解和修复边界。",
      "问题单缺少复现步骤时仍强行修复，导致补丁靠猜测。",
      "只看代码能否编译，不验证问题是否真正被复现和修复。",
      "允许 Agent 大范围重构，增加评审成本和回归风险。",
      "评审意见没有回流到模板、Skill 和评测集，导致同类错误反复出现。"
    ],
    "diagnosticQuestion": {
      "id": "q-issue-fix-agent-1",
      "type": "single",
      "scenario": "某 Issue Fix Agent 对“订单页偶现空白”问题提交了一个大范围重构 PR，但没有复现用例，也没有说明根因。评审认为风险过高并退回。",
      "question": "最应该先改进哪一环？",
      "options": [
        {
          "id": "a",
          "text": "要求问题单结构化，并让 Agent 在信息不足时先澄清和复现，再最小化修改"
        },
        {
          "id": "b",
          "text": "让 Agent 扩大搜索范围并生成多个候选根因，再选择最可能的一项修改"
        },
        {
          "id": "c",
          "text": "要求 Agent 先补充更详细 PR 描述和风险说明，再维持当前补丁范围"
        },
        {
          "id": "d",
          "text": "优先增加自动生成测试用例，但不要求先复现原始问题"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "没有复现、根因和边界的大范围修改不适合自动合入。b 会扩大搜索，但仍可能在信息不足时猜测根因；c 改善 PR 可读性，却没有改变补丁风险；d 是强干扰项，测试是必要门禁，但如果没有先复现原始问题，生成的测试可能只验证 Agent 的假设。第一步应规范问题输入、复现和澄清机制，再最小化修改并提交验证证据。",
      "troubleshootingPath": [
        "检查 Issue 是否包含现象、复现步骤、期望行为和日志",
        "要求 Agent 先复现或声明无法复现",
        "限定修改范围并说明根因假设",
        "运行相关测试并把证据写入 PR",
        "把退回原因回流到 Issue 模板和 Skill"
      ],
      "relatedConceptIds": [
        "agent-loop",
        "repo-context",
        "spec-driven-development",
        "test-generation-agent",
        "human-in-the-loop"
      ]
    },
    "keyTakeaways": [
      "Issue Fix Agent 不是直接让 AI 改代码。",
      "修复闭环包括理解、定位、修改、测试、PR 和人审。",
      "问题单质量决定修复成功率。",
      "最小修改和验证证据比大范围重构更重要。",
      "评审反馈要回流到流程和 Skill。"
    ],
    "relatedConceptIds": [
      "agent-loop",
      "repo-context",
      "spec-driven-development",
      "test-generation-agent",
      "code-review-agent",
      "human-in-the-loop"
    ]
  },
  {
    "id": "semantic-space",
    "title": "词向量与语义空间",
    "slug": "semantic-space",
    "moduleId": "m1",
    "order": 2,
    "difficulty": "basic",
    "estimatedMinutes": 8,
    "tags": ["Embedding", "语义搜索", "向量召回", "RAG", "相似度"],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "词向量与语义空间是把文本片段映射到可计算坐标中的方法，让模型能够用距离、方向和邻近关系处理含义相近、角色相似或上下文相关的表达。",
    "whyItMatters": "企业 AI 应用里的搜索、召回、分类、路由、聚类和相似问题归并，都依赖某种语义空间。它解决的不是“模型会不会懂中文”这种抽象问题，而是把业务语言变成可度量对象：哪些工单相似，哪些知识库片段应该召回，哪些用户问题应该走同一条处理链路。当召回结果跑偏、相似问法命中不同答案、客服意图聚类混乱时，平台侧要看的往往不是页面文案，而是向量模型版本、embedding 维度、召回阈值、top-k、语料分片和重排效果。",
    "mentalModel": "语义空间更像一张持续被校准的业务地图。地图上的点不是城市，而是句子、片段、问题和标签；距离近只表示“在当前向量模型看来相似”，不等于业务上一定可替代。工程负责人真正要判断的是：这张地图用来导航哪类任务，比例尺是否合适，边界外的业务概念是否被硬塞进同一套坐标。",
    "mechanism": [
      "文本先经过 tokenizer 和 embedding 模型，转换成固定维度或近似固定结构的向量表示。",
      "向量空间中的距离或相似度通常用于召回、聚类、去重和路由，常见指标包括 cosine similarity、dot product 或归一化后的距离。",
      "语义空间由训练数据和 embedding 模型决定，同一业务短语在不同模型版本中可能落到不同位置。",
      "分片策略会改变向量点的含义；把整份制度、单段条款和一句标题分别向量化，召回结果会非常不同。",
      "企业系统通常需要把向量召回与关键词过滤、权限过滤、时间版本、重排模型和人工评测结合，避免语义相近但业务错误的命中。"
    ],
    "enterpriseCase": {
      "title": "售后工单相似问题归并失真",
      "scenario": "某制造企业把 18 万条售后工单接入知识库助手，希望自动识别相似故障并推荐处理 SOP。",
      "problem": "上线后“电机过热”“轴承温升异常”“环境温度过高”被频繁归到同一类，top-5 召回命中率在抽样评测中只有 61%，一线工程师反馈推荐步骤经常越过安全检查。",
      "analysis": "系统只使用通用 embedding 模型和 0.78 相似度阈值，没有把设备型号、故障部位、运行环境作为过滤边界；分片也把现象、原因、处理步骤混在同一向量里，导致相似词汇压过业务约束。",
      "solution": "按设备型号和故障部位先做结构化过滤，再做向量召回；将工单拆成现象、诊断证据、处理动作三类向量；用 800 条人工标注对阈值和 top-k 做回放。",
      "takeaway": "语义空间适合找候选相似，但企业落地必须叠加系统边界、权限、版本和验证集，否则相似度会把业务上不能混用的对象拉到一起。"
    },
    "pitfalls": [
      "认为向量距离近就代表业务含义可互换，忽略权限、版本、设备型号和场景约束。",
      "只换更大的 embedding 模型，不检查分片策略和召回阈值。",
      "用少量主观搜索体验判断效果，没有建立召回评测集和负样本。",
      "把向量库当成知识库本身，忘记它只是候选召回层。"
    ],
    "diagnosticQuestion": {
      "id": "q-semantic-space-1",
      "type": "single",
      "scenario": "一个内部制度问答系统上线后，用户问“出差住宿标准”时经常召回“长期外派补贴”和“客户招待标准”。日志显示向量召回 top-5 相似度都高于 0.82，但人工抽样 top-1 可用率只有 58%。",
      "question": "第一步最应该排查什么？",
      "options": [
        { "id": "a", "text": "检查分片、元数据过滤和召回阈值是否把不同制度类型混在同一候选池里" },
        { "id": "b", "text": "立即更换更大参数量的生成模型，让模型自己判断哪条制度更相关" },
        { "id": "c", "text": "把 top-k 从 5 提高到 20，避免漏掉真正相关的片段" },
        { "id": "d", "text": "在回答提示词中加入“请只引用最相关制度”" }
      ],
      "correctOptionIds": ["a"],
      "explanation": "A 直接检查语义空间落地的候选池质量，是第一步。B 可能改善生成判断，但如果召回候选本身混入错误制度，会把问题后移。C 是强干扰项，扩大 top-k 可能提高召回覆盖，却也会增加噪声。D 有帮助但属于生成侧约束，不能修复制度类型和分片边界错误。",
      "troubleshootingPath": ["抽样查看被召回片段的制度类型、版本和适用人群", "检查分片粒度是否把标题、适用范围和正文拆散", "回放不同相似度阈值与 top-k 的命中率", "加入制度类型、时间版本和组织范围过滤", "用人工标注集验证 top-1/top-3 可用率"],
      "relatedConceptIds": ["token", "transformer", "attention", "context-window", "maas"]
    },
    "keyTakeaways": [
      "语义空间是候选召回和相似判断的基础设施，不是业务正确性的保证。",
      "向量效果由模型、分片、阈值、过滤和评测集共同决定。",
      "企业应用要把语义相似放进权限、版本和业务边界中使用。",
      "排查召回偏差时先看候选池，再看生成模型。"
    ],
    "relatedConceptIds": ["token", "transformer", "attention", "context-window", "maas"]
  },
  {
    "id": "transformer",
    "title": "Transformer",
    "slug": "transformer",
    "moduleId": "m1",
    "order": 3,
    "difficulty": "basic",
    "estimatedMinutes": 10,
    "tags": ["Transformer", "Attention", "长上下文", "推理性能", "RAG"],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "Transformer 是现代大模型的核心神经网络架构，它通过注意力机制和多层表示变换，把上下文中的 token 关系逐层加工成可用于预测下一个 token 的内部状态。",
    "whyItMatters": "Transformer 决定了大模型为什么能在同一套架构中处理摘要、问答、代码、规划和工具调用等任务。对企业工程负责人来说，理解 Transformer 不是为了手写模型，而是为了判断上下文长度、注意力开销、推理延迟、RAG 证据组织、长文本效果衰减和模型能力边界。当系统出现首字延迟高、长上下文质量下降、证据被忽略或复杂指令不稳定时，很多现象都能追溯到 Transformer 如何在有限计算中分配上下文关系。",
    "mentalModel": "把 Transformer 看成一座多层加工厂：原料是 token 序列，每一层都会重新评估哪些位置与当前预测有关，再把局部线索加工成更抽象的表示。工厂可以处理很多任务，但每次加工都受输入长度、位置编码、注意力计算和模型参数的限制；给它更多材料不一定更好，材料组织错误反而会占用加工能力。",
    "mechanism": [
      "输入 token 会先变成 embedding，并叠加位置信息，让模型同时知道是什么和在序列哪里。",
      "每一层通过自注意力计算 token 之间的关系，使当前位置能够利用历史上下文中的相关信息。",
      "前馈网络会对注意力聚合后的表示做非线性变换，提炼更适合预测的特征。",
      "多头注意力允许模型从不同关系视角处理上下文，例如指代、格式、约束、证据和语法。",
      "层数、隐藏维度、注意力头数和上下文长度共同影响能力、显存、吞吐和延迟。",
      "自回归大模型在推理时基于当前上下文表示预测下一个 token，并把新 token 追加回上下文继续计算。"
    ],
    "enterpriseCase": {
      "title": "长制度问答在 20 页附件后开始忽略关键约束",
      "scenario": "某集团法务助手允许用户上传合同和内部制度，单次请求平均 35k 输入 token，峰值超过 90k。",
      "problem": "模型能流畅回答，但对例外条款和审批层级漏读率高；抽样 300 个问题，长上下文下关键约束命中率从 86% 降到 63%。",
      "analysis": "问题不是单纯模型不够聪明。长输入让注意力计算和证据竞争变重，RAG 片段、历史对话和附件全文混在一起，关键条款没有被结构化置顶；平台只监控总 token，没有监控证据命中和引用位置。",
      "solution": "把全文直塞改为检索候选、条款重排、关键约束置顶和引用校验；限制附件全文进入上下文的比例，并建立长上下文回放集。",
      "takeaway": "Transformer 能利用上下文，但企业系统要主动组织上下文，而不是把所有材料交给模型自行消化。"
    },
    "pitfalls": [
      "把 Transformer 理解成万能理解器，忽略输入组织和计算预算。",
      "认为上下文越长越安全，实际可能让关键证据在注意力竞争中被稀释。",
      "只比较模型榜单分数，不比较自己任务上的延迟、引用准确率和失败样本。",
      "把所有问题都归因于参数量，不检查 RAG、提示词、位置和分片。",
      "忽略推理阶段的 KV Cache、Prefill 和 Decode 对性能的影响。"
    ],
    "diagnosticQuestion": {
      "id": "q-transformer-1",
      "type": "single",
      "scenario": "企业知识库助手换成长上下文模型后，用户可以一次上传更多材料，但复杂制度问答的准确率没有提升，TTFT 从 1.2s 上升到 5.8s，错误样本多为忽略附件中后段的限制条款。",
      "question": "最优先的判断是什么？",
      "options": [
        { "id": "a", "text": "长上下文模型不适合企业问答，应立即退回短上下文模型" },
        { "id": "b", "text": "检查上下文组织、证据排序和关键约束位置，而不是只看窗口变大" },
        { "id": "c", "text": "把 temperature 调低到 0，优先消除生成随机性" },
        { "id": "d", "text": "增加更多附件全文，让模型拥有更完整的信息" }
      ],
      "correctOptionIds": ["b"],
      "explanation": "B 对应 Transformer 在有限计算中处理上下文关系的工程问题。A 过早下结论，短窗口未必更好。C 可能降低随机性，但不能解决证据位置和注意力竞争。D 是强干扰项，看似补充信息，实际可能继续提高 Prefill 成本并加剧噪声。",
      "troubleshootingPath": ["对错误样本标注正确证据所在位置", "检查 RAG 片段排序、附件截断和关键条款是否置顶", "分别回放全文直塞、检索片段、重排片段三种输入", "记录 TTFT、输入 token、引用准确率和约束命中率", "用失败样本校准上下文拼接策略"],
      "relatedConceptIds": ["token", "attention", "positional-encoding", "autoregressive", "prefill", "decode", "context-window"]
    },
    "keyTakeaways": [
      "Transformer 的能力来自多层注意力和表示变换，而不是神秘理解。",
      "长上下文提高容量，同时提高成本和证据竞争。",
      "企业系统要设计上下文组织策略，让模型看到正确材料。",
      "评估 Transformer 相关方案时要同时看质量、延迟、成本和失败路径。",
      "RAG、Agent、MaaS 性能治理都建立在对 Transformer 推理特性的理解之上。"
    ],
    "relatedConceptIds": ["token", "attention", "positional-encoding", "autoregressive", "prefill", "decode", "context-window"]
  },
  {
    "id": "positional-encoding",
    "title": "位置编码",
    "slug": "positional-encoding",
    "moduleId": "m1",
    "order": 5,
    "difficulty": "basic",
    "estimatedMinutes": 7,
    "tags": ["Position Encoding", "上下文顺序", "长上下文", "Prompt Context"],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "位置编码是让模型知道 token 在序列中相对或绝对位置的机制，避免 Transformer 只看到一袋 token 而无法区分顺序、距离和结构。",
    "whyItMatters": "企业应用中，顺序经常就是含义：审批链条、合同条款层级、代码调用顺序、对话轮次和工具执行结果都不能随意打乱。位置编码解释了为什么长上下文模型会有有效长度、为什么靠后的证据可能被忽略、为什么把关键约束放在提示词开头或结尾会影响效果。平台侧要关注的不只是窗口大小，还包括截断策略、上下文拼接顺序、位置外推能力和长文本回放评测。",
    "mentalModel": "同一组材料放进模型，就像把文件摆在一张长桌上。位置编码给每份材料贴上座位号；座位号本身不是内容，但它会影响模型在处理前文说过什么、当前该看哪里、谁约束谁时的判断。座位安排混乱，模型可能不是不知道规则，而是没在正确位置上使用规则。",
    "mechanism": [
      "Transformer 的注意力本身不天然知道 token 顺序，需要额外位置信号参与计算。",
      "位置编码可以是绝对位置、相对位置、旋转位置编码等形式，具体实现会影响长上下文表现。",
      "推理时，token 的位置会随上下文长度增长而变化；同一证据放在不同位置，效果可能不同。",
      "当输入超过模型训练或优化良好的长度区域时，位置外推和注意力稳定性可能下降。"
    ],
    "enterpriseCase": {
      "title": "审批规则放在长上下文末尾后被忽略",
      "scenario": "某费用报销助手把用户历史对话、报销制度、发票 OCR 和审批规则拼成上下文，平均输入 18k token。",
      "problem": "当审批规则位于上下文末尾时，模型对“超过 5000 元需二级审批”的命中率只有 70%；把规则前置并压缩历史后，命中率提升到 91%。",
      "analysis": "系统边界没有区分背景材料和硬约束。位置顺序让模型更容易受近期 OCR 和用户补充说明影响，关键规则虽然在窗口内，但没有被稳定使用。",
      "solution": "将硬约束固定放在系统提示词后第一段，对历史对话做摘要，对 OCR 结果只保留与金额、票据类型、部门相关的结构化字段。",
      "takeaway": "位置不是排版细节，而是上下文工程的一部分；关键约束要有稳定位置和验证用例。"
    },
    "pitfalls": [
      "认为只要内容在上下文窗口内，模型就会等价利用。",
      "把关键约束、用户输入、RAG 片段和工具结果随意拼接。",
      "只测试短输入，不测试长输入和多轮对话后的规则命中率。"
    ],
    "diagnosticQuestion": {
      "id": "q-positional-encoding-1",
      "type": "single",
      "scenario": "报销 Agent 在单轮测试中能正确执行“超过 5000 元二级审批”，但多轮对话后经常漏掉。日志显示规则仍在上下文中，只是排在历史对话和 OCR 明细之后。",
      "question": "第一步应该做什么？",
      "options": [
        { "id": "a", "text": "把模型换成更大参数版本，提升规则理解能力" },
        { "id": "b", "text": "增加一条提示词：“请认真遵守所有规则”" },
        { "id": "c", "text": "固定硬约束在上下文中的优先位置，并回放多轮样本验证命中率" },
        { "id": "d", "text": "删除所有历史对话，只保留最后一轮用户输入" }
      ],
      "correctOptionIds": ["c"],
      "explanation": "C 直接处理位置编码和上下文组织带来的工程问题。A 可能有帮助，但在规则仍被错误摆放时不是第一步。B 只是弱约束，不能保证关键规则稳定进入有效位置。D 可能降低干扰，但会丢失必要对话信息，属于过度处理。",
      "troubleshootingPath": ["标注失败样本中硬约束的位置", "比较规则前置、后置、重复锚定三种拼接策略", "记录多轮长度、规则命中率和错误类型", "将历史对话压缩为结构化摘要", "为关键规则建立回归测试"],
      "relatedConceptIds": ["token", "transformer", "attention", "context-window", "prompt-context"]
    },
    "keyTakeaways": [
      "位置编码让顺序成为模型输入的一部分。",
      "在企业上下文工程中，材料摆放顺序会影响质量。",
      "关键约束要有稳定位置、结构化表达和回放验证。"
    ],
    "relatedConceptIds": ["token", "transformer", "attention", "context-window", "prompt-context"]
  },
  {
    "id": "autoregressive",
    "title": "自回归生成",
    "slug": "autoregressive",
    "moduleId": "m1",
    "order": 6,
    "difficulty": "basic",
    "estimatedMinutes": 8,
    "tags": ["Autoregressive", "Decode", "流式输出", "输出长度", "幻觉"],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "自回归生成是大模型每次基于已有上下文预测下一个 token，再把新 token 接回上下文继续生成的机制。",
    "whyItMatters": "自回归解释了为什么输出是逐字出现、为什么长答案更慢、为什么错误会沿着后续文本扩散，也解释了 Agent 为什么需要中途检查和停止条件。企业系统里，Decode 延迟、输出阶段单 token 间隔、最大输出长度、流式响应、工具调用循环和幻觉扩散都与自回归有关。排查时不能只看总耗时，要拆开首字前和首字后的生成链路。",
    "mentalModel": "模型不是一次性把完整答案吐出来，而像一名边写边读自己草稿的助手。每写下一个 token，它都会成为下一步判断的一部分；前面一旦选错方向，后面的文字往往会继续沿着这个方向补全，看起来越来越自洽，但不一定越来越正确。",
    "mechanism": [
      "推理开始时，模型先根据输入上下文完成 Prefill，得到可用于生成的内部状态。",
      "Decode 阶段每一步都会根据当前上下文分布预测下一个 token。",
      "被选中的 token 会追加到上下文中，参与下一步预测。",
      "生成长度越长，Decode 循环次数越多，总耗时和输出成本越高。",
      "如果早期 token 偏离事实或格式，后续 token 可能沿着错误上下文继续扩写，因此需要引用校验、停止条件和中途检查。"
    ],
    "animation": {
      "type": "token-flow",
      "title": "逐 Token 生成与输出成本",
      "steps": [
        { "id": "s1", "title": "输入进入上下文", "description": "用户问题先作为上下文进入模型链路，后续生成都基于这段上下文展开。", "highlightTargets": ["input-text"] },
        { "id": "s2", "title": "上下文被拆成 Token", "description": "模型面对的是 token 序列；后续每一步都会在这个序列后追加新 token。", "highlightTargets": ["tokens"] },
        { "id": "s3", "title": "Prefill 准备首个输出", "description": "首个输出前先处理完整输入上下文，建立可用于生成的内部状态。", "highlightTargets": ["prefill"] },
        { "id": "s4", "title": "Decode 逐个预测", "description": "模型每次只选择下一个 token，被选中的 token 会立刻成为下一步预测的上下文。", "highlightTargets": ["decode", "output-tokens"] },
        { "id": "s5", "title": "输出越长成本越高", "description": "生成越长，Decode 循环次数越多，完整回答耗时和输出成本都会上升。", "highlightTargets": ["output-tokens", "cost"] }
      ]
    },
    "enterpriseCase": {
      "title": "客服助手长回答导致尾部错误扩散",
      "scenario": "某客服助手每天约 12 万次对话，开启流式输出和“详细解释”模式后，平均输出从 180 token 增加到 620 token。",
      "problem": "用户满意度短期上升，但抽检发现后半段补充说明的事实错误率从 4% 上升到 13%，单 token 输出间隔稳定但总输出耗时明显变长。",
      "analysis": "模型在前半段给出正确方向后，继续自回归扩写，尾部缺少检索证据支持；系统只限制输入 token，没有限制答案结构和停止条件。",
      "solution": "把回答拆成直接结论、依据、下一步动作三段，设置最大输出 token 和引用覆盖要求；对无证据扩展触发建议转人工或补充检索。",
      "takeaway": "自回归生成越长，越需要结构、证据和停止条件控制。"
    },
    "pitfalls": [
      "认为流式输出变快等于总生成变快；流式只改善感知首字，不减少后续 Decode 次数。",
      "用回答更详细掩盖无证据扩写，导致尾部幻觉增多。",
      "只调 temperature，不限制输出结构、证据覆盖和停止条件。",
      "把首字慢和全文慢混在一起排查，忽略 Prefill 与 Decode 分工。"
    ],
    "diagnosticQuestion": {
      "id": "q-autoregressive-1",
      "type": "single",
      "scenario": "客服助手开启“详细模式”后，首字时间几乎不变，但完整回答耗时翻倍，后半段事实错误明显增多。监控显示平均输出 token 增长 3 倍。",
      "question": "最应该优先采取哪项措施？",
      "options": [
        { "id": "a", "text": "扩容推理实例，先提高整体吞吐" },
        { "id": "b", "text": "把 temperature 调到 0，减少随机性" },
        { "id": "c", "text": "增加更多历史对话，帮助模型保持一致" },
        { "id": "d", "text": "限制输出结构和最大生成长度，并对无证据扩写设置停止或补检索" }
      ],
      "correctOptionIds": ["d"],
      "explanation": "D 直接对应自回归 Decode 变长和错误扩散。A 是强干扰项，扩容能缓解排队但不能减少单次输出循环和幻觉尾巴。B 可能降低随机性，但仍会在错误上下文里稳定扩写。C 可能加重输入负担，也不解决输出过长。",
      "troubleshootingPath": ["拆分首字时间、输出阶段单 token 间隔、输出 token 数和总耗时", "抽检错误出现在答案的哪个段落", "对比详细模式和结构化短回答的事实错误率", "设置最大输出长度、证据引用和停止条件", "回放高风险问题并观察尾部幻觉是否下降"],
      "relatedConceptIds": ["token", "transformer", "sampling", "decode", "ttft", "hallucination", "agent-loop"]
    },
    "keyTakeaways": [
      "自回归生成是一轮一轮预测下一个 token。",
      "输出越长，Decode 循环、成本和错误扩散风险越高。",
      "流式输出改善感知，不等于减少完整生成成本。",
      "企业应用需要用结构、证据和停止条件管理生成过程。"
    ],
    "relatedConceptIds": ["token", "transformer", "sampling", "decode", "ttft", "hallucination", "agent-loop"]
  },
  {
    "id": "sampling",
    "title": "采样策略",
    "slug": "sampling",
    "moduleId": "m1",
    "order": 7,
    "difficulty": "basic",
    "estimatedMinutes": 8,
    "tags": ["Sampling", "Temperature", "top-p", "稳定性", "评测"],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "采样策略是在模型给出下一个 token 概率分布后，决定选哪个 token 的规则，直接影响输出的确定性、多样性和风险。",
    "whyItMatters": "同一个模型在不同 temperature、top-p、top-k、seed 和停止条件下，会表现出不同的稳定性和创造性。企业应用不是一律追求更聪明或更有创意，而是要按任务分层：财务、法务、运维诊断更重稳定和可验证，营销文案、头脑风暴可以保留多样性。采样策略出问题时，用户看到的是同问不同答、格式漂移、引用不稳定或 Agent 行动选择摇摆。",
    "mentalModel": "采样像从候选答案里抽签，但签筒不是均匀的。模型先给每个下一个 token 一个概率，采样策略决定是总拿最高分，还是允许低概率但有可能更有创造性的选项进入。工程判断的关键不是随机好不好，而是任务是否允许随机。",
    "mechanism": [
      "模型每一步输出的是下一个 token 的概率分布，而不是直接输出唯一答案。",
      "贪心解码总选最高概率 token，稳定但可能保守。",
      "temperature 会调整概率分布的尖锐程度，越高越容易选择低概率 token。",
      "top-p/top-k 会限制候选 token 集合，控制随机范围。",
      "企业系统需要把采样参数与任务类型、风险级别、评测指标和回放策略绑定。"
    ],
    "enterpriseCase": {
      "title": "合同摘要同问不同答引发审计风险",
      "scenario": "某合同管理系统每月生成约 4 万份合同摘要，供法务初筛风险条款。",
      "problem": "同一合同重复生成摘要时，风险条款表述和排序不稳定；抽样 500 份，关键条款漏报率在不同批次间从 3% 波动到 11%。",
      "analysis": "平台把营销文案任务的 temperature=0.8 复用到合同摘要；同时没有固定输出 schema 和引用要求，导致模型在低概率表达之间游走。",
      "solution": "按任务风险分层，合同摘要使用低 temperature、固定 schema、条款引用和回放评测；创意类任务保留较高多样性但不得进入审计链路。",
      "takeaway": "采样参数是产品策略和风险控制的一部分，不是随手调的模型小旋钮。"
    },
    "pitfalls": [
      "把 temperature 当成智能程度旋钮，越高越好。",
      "所有任务共用一套采样参数，忽略风险等级。",
      "只看单次输出质量，不看同输入重复生成的一致性。",
      "用采样参数掩盖提示词、检索证据或输出 schema 问题。",
      "Agent 工具选择也使用过高随机性，导致行动路径不稳定。"
    ],
    "diagnosticQuestion": {
      "id": "q-sampling-1",
      "type": "single",
      "scenario": "合同摘要服务同一输入重复运行 5 次，条款排序和风险描述差异很大。业务要求摘要可审计、可复现。当前 temperature=0.9，并且没有强制引用条款编号。",
      "question": "第一步最合理的处理是什么？",
      "options": [
        { "id": "a", "text": "将高风险摘要任务切到低随机采样，并固定输出 schema 与引用要求" },
        { "id": "b", "text": "增加候选摘要数量，让用户从 5 个版本里选择最好的" },
        { "id": "c", "text": "扩大 top-p，让模型覆盖更多可能表达" },
        { "id": "d", "text": "保持参数不变，只在页面提示“AI 结果仅供参考”" }
      ],
      "correctOptionIds": ["a"],
      "explanation": "A 直接匹配可审计任务的稳定性要求。B 是强干扰项，多候选适合创意探索，但会增加审计负担。C 会进一步扩大随机范围。D 是免责声明，不能解决系统行为不稳定。",
      "troubleshootingPath": ["标记任务风险等级和可复现要求", "对同一输入重复运行，度量字段一致性和漏报率", "调低 temperature/top-p 并固定 schema", "要求关键结论绑定条款引用", "建立合同样本回归集，比较参数变更前后波动"],
      "relatedConceptIds": ["autoregressive", "hallucination", "instruction-tuning", "eval", "trace"]
    },
    "keyTakeaways": [
      "采样策略决定模型如何从概率分布中选择下一个 token。",
      "低风险创意任务和高风险审计任务不应共用采样策略。",
      "稳定性要通过重复运行、schema 和引用校验来验证。",
      "采样参数不能替代检索、提示词和评测治理。",
      "Agent 行动选择也需要受采样策略约束。"
    ],
    "relatedConceptIds": ["autoregressive", "hallucination", "instruction-tuning", "eval", "trace"]
  },
  {
    "id": "instruction-tuning",
    "title": "指令微调与偏好优化",
    "slug": "instruction-tuning",
    "moduleId": "m1",
    "order": 8,
    "difficulty": "intermediate",
    "estimatedMinutes": 10,
    "tags": ["Instruction Tuning", "Preference Optimization", "对齐", "微调", "评测"],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "指令微调与偏好优化是把基础模型调整成更愿意遵循人类指令、输出可用格式并符合偏好标准的训练过程。",
    "whyItMatters": "企业应用使用的大多数对话模型并不是裸基础模型，而是经过指令微调、偏好优化和安全对齐后的模型。它影响模型是否听指令、是否按格式输出、是否拒答、是否偏好看起来有帮助的表达。理解这一层，能帮助负责人判断：哪些行为应通过提示词和系统设计解决，哪些需要选型或微调，哪些其实是偏好目标与业务目标不一致。",
    "mentalModel": "基础模型像读过大量资料但没有岗位培训的人；指令微调像入职培训，偏好优化像绩效评分规则。它能让人更像客服、分析师或助手，但如果评分标准偏向回答得像样，而不是答案可验证，模型就可能把流畅和自信排在证据之前。",
    "mechanism": [
      "基础模型先通过大规模预训练学习语言和知识分布，但未必天然遵循指令。",
      "指令微调用成对的指令和答案样本训练模型按任务要求回答。",
      "偏好优化通过人类或模型评审的偏好信号，让模型更倾向于被认为有帮助、安全、清晰的回答。",
      "对齐后的模型更适合对话和工具入口，但也可能形成拒答、迎合、过度解释或格式依赖。",
      "企业如需领域适配，应区分提示词、RAG、评测集、小规模微调和偏好数据的作用边界。",
      "微调上线必须监控回归风险：通用能力下降、拒答率变化、格式稳定性和关键任务准确率。"
    ],
    "enterpriseCase": {
      "title": "内部助手过度迎合用户导致政策误答",
      "scenario": "某集团为 HR 助手做领域微调，训练集包含 2.5 万条问答和人工偏好标注，希望提升语气和格式一致性。",
      "problem": "上线灰度后，员工询问“能否破例报销”时，模型更常给出变通建议；抽检发现政策边界类问题准确率从 88% 降到 79%。",
      "analysis": "偏好数据中“语气友好、给出解决方案”的样本得分高，而“明确拒绝并引用制度”的样本不足；优化目标偏向帮助感，弱化了硬约束。",
      "solution": "补充拒绝、升级人工、引用制度的偏好样本；把政策边界问题加入回归评测；对高风险场景使用 RAG 引用和规则校验，而不是只靠微调。",
      "takeaway": "指令微调提升可用性，但企业偏好标准必须把合规、证据和升级路径写进去。"
    },
    "pitfalls": [
      "认为所有业务知识都应该通过微调注入，忽略 RAG 更适合频繁变化的事实。",
      "把偏好优化等同于质量提升，却没有定义企业自己的偏好标准。",
      "只看回答语气和格式，不看关键任务准确率、拒答率和升级率。",
      "微调后不做回归评测，导致原本稳定的通用能力退化。"
    ],
    "diagnosticQuestion": {
      "id": "q-instruction-tuning-1",
      "type": "single",
      "scenario": "HR 助手微调后语气更自然，但在政策边界问题上更常给出“可以尝试申请”的建议，合规团队发现拒绝类答案比例下降。训练偏好样本主要奖励“给出可执行建议”。",
      "question": "第一步应该怎么判断和修正？",
      "options": [
        { "id": "a", "text": "继续增加训练轮数，让模型更充分学习 HR 语气" },
        { "id": "b", "text": "审查偏好数据和评测集是否缺少合规拒绝、引用制度和升级人工样本" },
        { "id": "c", "text": "把所有政策文件放入系统提示词，避免模型不知道制度" },
        { "id": "d", "text": "提高 temperature，让回答覆盖更多可能处理方式" }
      ],
      "correctOptionIds": ["b"],
      "explanation": "B 直接处理偏好目标与业务目标错位。A 可能放大错误偏好。C 是强干扰项，增加制度上下文有帮助，但如果偏好仍奖励迎合，模型仍可能给出不合规建议。D 会提高不稳定性，不适合合规边界场景。",
      "troubleshootingPath": ["抽样政策边界问题，标注正确动作是拒绝、解释还是升级", "检查偏好数据中合规拒绝样本占比", "对比微调前后准确率、拒答率和升级率", "补充制度引用和人工升级偏好样本", "用回归集验证微调版本再灰度上线"],
      "relatedConceptIds": ["transformer", "sampling", "hallucination", "eval", "human-in-the-loop"]
    },
    "keyTakeaways": [
      "指令微调让模型更会按任务形式回答。",
      "偏好优化会塑造模型的行为倾向，不一定天然符合企业目标。",
      "业务知识、实时事实和合规约束不应全部依赖微调。",
      "微调上线必须配套评测、灰度和回归监控。"
    ],
    "relatedConceptIds": ["transformer", "sampling", "hallucination", "eval", "human-in-the-loop"]
  },
  {
    "id": "hallucination",
    "title": "幻觉",
    "slug": "hallucination",
    "moduleId": "m1",
    "order": 9,
    "difficulty": "intermediate",
    "estimatedMinutes": 10,
    "tags": ["Hallucination", "RAG", "证据链", "Eval", "Trace"],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "幻觉是模型生成了看似合理但缺少事实依据、与上下文冲突或无法被系统证据支持的内容。",
    "whyItMatters": "幻觉不是单纯模型胡说，而是生成式系统在证据、约束、采样、上下文和任务边界失效时的外显症状。企业用户看到的是错误引用、编造政策、虚构 API、错误操作建议或自信的误判。平台侧要看的指标包括引用覆盖率、无证据回答率、检索命中率、冲突证据处理、拒答/升级率和人工复核通过率。",
    "mentalModel": "模型像一个非常擅长续写的人：当证据足够、约束清楚时，它能把材料组织成好答案；当证据缺失或冲突时，它仍可能沿着语言模式补出一个顺滑结论。幻觉治理的重点不是要求模型更诚实这一句口号，而是让系统知道什么时候有证据、什么时候该停下、什么时候该请求检索或人工。",
    "mechanism": [
      "自回归生成会不断选择下一个 token，语言连贯性不等于事实正确性。",
      "当上下文缺少证据、检索片段错误或提示词要求必须回答时，模型更容易补全不存在的信息。",
      "高随机采样、长输出和复杂多步任务会增加无证据扩写机会。",
      "RAG 系统中的幻觉常来自召回错误、引用未校验、版本冲突或片段缺失。",
      "Agent 场景中的幻觉可能表现为虚构工具结果、误读日志、编造文件路径或错误判断任务完成。"
    ],
    "enterpriseCase": {
      "title": "运维助手编造不存在的配置项",
      "scenario": "某云平台运维助手接入日志、告警和内部 runbook，每天处理约 6000 次排障咨询。",
      "problem": "一次数据库连接池告警中，助手建议修改一个并不存在的参数名，值班工程师照做失败，导致恢复时间增加 18 分钟。",
      "analysis": "检索没有命中对应版本 runbook，模型根据相似产品文档补全了看似合理的参数；系统没有要求引用配置来源，也没有对工具查询失败设置拒答或升级。",
      "solution": "强制关键操作建议绑定 runbook 版本和配置路径；无证据时输出需要人工确认；将不存在参数、跨版本参数加入评测集。",
      "takeaway": "幻觉治理要围绕证据、版本、工具结果和升级路径建立系统约束，而不是只在提示词里要求不要编造。"
    },
    "pitfalls": [
      "认为把 temperature 调低就能消除幻觉。",
      "要求模型不要编造，但没有证据引用、检索校验和拒答路径。",
      "把幻觉全部归因于模型能力，不排查 RAG 召回、版本和权限过滤。",
      "只看回答是否流畅，不记录引用覆盖率和人工复核结果。",
      "Agent 工具失败后仍让模型继续总结，导致虚构工具结果。"
    ],
    "diagnosticQuestion": {
      "id": "q-hallucination-1",
      "type": "single",
      "scenario": "运维助手在某次告警中建议修改不存在的配置项。日志显示检索没有命中当前版本 runbook，但模型仍输出了具体参数名和修改值。当前提示词要求“尽量给出可执行修复步骤”。",
      "question": "最应该优先修复哪一层？",
      "options": [
        { "id": "a", "text": "降低 temperature，并保持当前“尽量给出步骤”的产品要求" },
        { "id": "b", "text": "增加更多通用运维文档，让模型拥有更广知识" },
        { "id": "c", "text": "为关键操作建立证据引用、版本校验和无证据升级路径" },
        { "id": "d", "text": "把回答改得更保守，但不改变检索和工具链路" }
      ],
      "correctOptionIds": ["c"],
      "explanation": "C 直接修复幻觉的证据链和系统边界。A 只能降低随机性，不能保证不存在参数不被稳定编造。B 是强干扰项，更多文档可能带来更多跨版本噪声。D 改语气不能解决无证据仍输出操作建议的问题。",
      "troubleshootingPath": ["查看错误建议是否有引用来源和版本", "检查检索未命中时的生成策略", "对关键操作要求工具查询或 runbook 引用", "设置无证据时的拒答、补检索或人工升级", "建立不存在参数和版本冲突的回归评测"],
      "relatedConceptIds": ["autoregressive", "sampling", "attention", "context-window", "eval", "trace"]
    },
    "keyTakeaways": [
      "幻觉是缺证据、错上下文、弱约束和生成机制共同作用的结果。",
      "流畅、自信和详细都不能证明答案正确。",
      "RAG 场景要治理召回、引用、版本和证据覆盖。",
      "Agent 场景要防止虚构工具结果和错误完成判断。",
      "企业治理应使用评测、trace、人工复核和升级路径闭环。"
    ],
    "relatedConceptIds": ["autoregressive", "sampling", "attention", "context-window", "eval", "trace"]
  },
  {
    "id": "reasoning-limit",
    "title": "推理能力边界",
    "slug": "reasoning-limit",
    "moduleId": "m1",
    "order": 10,
    "difficulty": "intermediate",
    "estimatedMinutes": 12,
    "tags": ["Reasoning", "任务拆解", "工具调用", "Eval", "人审"],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "推理能力边界是模型在长链路任务、隐含约束、反事实判断、数学精确性和跨文件一致性上会失真的范围；它由上下文组织、任务拆解、工具可用性、反馈闭环和验证机制共同决定。",
    "whyItMatters": "企业 AI 应用不能把模型当成一次性正确的决策者。推理边界一旦被忽略，用户看到的是“前面说得很像对，后面执行错了”：审批结论漏约束、Agent 改错文件、运营分析把口径混用、合规问答忽略例外条款。平台侧要看任务成功率、步骤级错误率、人工升级率、工具调用成功率、评测集回归和跨轮一致性，而不是只看单轮回答是否流畅。",
    "mentalModel": "模型的推理像一个很强的临时分析师，但桌上资料、问题拆法、可用工具和复核机制决定了它能不能把复杂案子办完。短题里它可能表现很好；一旦任务跨越多份材料、多个约束和多轮动作，就必须把“聪明回答”改造成“可检查流程”。",
    "mechanism": [
      "模型先在给定上下文内完成模式匹配和链式生成，但不会天然知道哪些约束必须跨步骤保持。",
      "上下文过长、证据冲突或关键条件被压缩掉时，模型会用看似合理的推断补空白。",
      "任务拆解不清会让模型在子目标之间漂移，例如先解释、再计划、再执行时口径逐步偏离。",
      "工具和外部校验能把部分推理转化为可验证操作，例如查询数据、运行测试、检查权限。",
      "反馈闭环决定错误是否被拦住：无评测、无 trace、无人审的链路会把早期误判继续放大。",
      "MaaS 或 Agent 平台要把复杂任务拆成计划、执行、检查、升级，而不是只放大 prompt。"
    ],
    "enterpriseCase": {
      "title": "财务分析 Agent 在跨表口径中得出错误结论",
      "scenario": "某集团把月度经营分析交给 Agent，任务涉及 8 张报表、3 个区域口径和一份例外政策，每月约 400 次分析请求。",
      "problem": "模型生成的文字结构清晰，但把“确认收入”和“开票收入”混用，导致两个区域的毛利率解释错误；人工复核发现复杂任务首版通过率只有 71%。",
      "analysis": "上下文里同时存在历史口径和新口径，任务没有拆成“口径确认 -> 数据查询 -> 计算校验 -> 文字生成”，模型在长链路里用语言连贯性补齐了缺失验证。",
      "solution": "把任务拆为四个检查点：先确认口径和期间，再用工具取数，再运行公式校验，最后生成结论；高金额差异必须触发人工复核。",
      "takeaway": "推理能力边界不是模型笨，而是复杂任务缺少可验证中间态。"
    },
    "pitfalls": [
      "认为模型在短问答中表现好，就能稳定完成长链路企业任务。",
      "把错误全部归因于模型能力，不检查上下文、工具权限、任务拆解和验证点。",
      "用更长 prompt 堆约束，却不建立步骤级检查和失败升级。",
      "把“让模型解释推理过程”当成可靠验证，忽略外部数据和测试结果。",
      "只看最终答案正确率，不看中间步骤错误率和人工接管位置。"
    ],
    "diagnosticQuestion": {
      "id": "q-reasoning-limit-1",
      "type": "single",
      "scenario": "财务 Agent 在 8 张报表上生成经营分析，文字流畅，但抽检发现它混用了确认收入和开票收入。日志显示模型没有调用公式校验工具，直接生成结论。",
      "question": "最应该优先修复什么？",
      "options": [
        { "id": "a", "text": "换成参数更大的模型，提升复杂推理能力" },
        { "id": "b", "text": "把所有财务制度全文加入系统提示词" },
        { "id": "c", "text": "要求模型在答案里展示更完整的思考过程" },
        { "id": "d", "text": "把任务拆成口径确认、取数、公式校验、结论生成，并对高风险差异加人审" }
      ],
      "correctOptionIds": ["d"],
      "explanation": "D 把一次性生成变成可验证流程，直接覆盖口径混用和缺校验问题。A 是强干扰项，更大模型可能改善部分推理，但不能保证口径和公式被验证。B 会增加上下文负担，仍可能混用。C 展示过程不等于外部验证，甚至可能把错误解释得更像真的。",
      "troubleshootingPath": ["找出错误发生在口径识别、取数、计算还是表达阶段", "查看是否调用了数据查询、公式校验和版本化规则工具", "为高风险报表建立步骤级 trace", "把复杂任务拆成可回放检查点", "用历史错例评测任务通过率和人工升级率"],
      "relatedConceptIds": ["hallucination", "context-window", "agent-loop", "tool-calling", "eval", "trace", "human-in-the-loop"]
    },
    "keyTakeaways": [
      "推理边界由模型、上下文、任务拆解、工具和验证机制共同决定。",
      "企业应用不能假设模型一次性正确，必须设计检查点。",
      "长链路任务要把推理转化为可观测、可回放、可升级的流程。",
      "评测集和人工复核是推理边界的工程护栏。"
    ],
    "relatedConceptIds": ["hallucination", "context-window", "agent-loop", "tool-calling", "eval", "trace", "human-in-the-loop"]
  },
  {
    "id": "tpot",
    "title": "TPOT",
    "slug": "tpot",
    "moduleId": "m2",
    "order": 4,
    "difficulty": "intermediate",
    "estimatedMinutes": 8,
    "tags": ["TPOT", "Decode", "吞吐", "流式输出", "推理性能"],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "TPOT 是首个输出 token 之后，每个后续 token 的平均生成耗时，用来衡量 Decode 阶段“说得快不快”。",
    "whyItMatters": "TTFT 决定用户等多久开始看到响应，TPOT 决定响应开始后是否顺滑。客服、代码生成、长文总结和 Agent 日志流中，TPOT 高会表现为文字一卡一卡、完整答案拖很久、流式输出体验差。平台侧要同时看 TPOT、输出 token 数、P50/P95/P99、batch 大小、KV Cache 命中、显存带宽和并发队列，而不能只看总耗时。",
    "mentalModel": "首字像主持人终于开口，TPOT 像他说话的语速。开口慢可能是前面读材料和排队；说话慢多半发生在逐 token Decode 阶段，和模型大小、并发、缓存、batch、显存带宽以及解码策略有关。",
    "mechanism": [
      "Prefill 完成后，模型进入 Decode，每一步生成一个或少量 token。",
      "TPOT 统计首 token 之后后续 token 的平均间隔，主要反映 Decode 阶段效率。",
      "模型越大、并发越高、KV 读写越重、显存带宽越紧，TPOT 越容易上升。",
      "Batch 调度会影响 TPOT：大 batch 提升吞吐，但可能让单个请求等待更久或间隔变宽。",
      "投机解码、量化和缓存优化可能降低 TPOT，但收益取决于命中率、质量回归和硬件适配。"
    ],
    "animation": {
      "type": "prefill-decode",
      "title": "首 Token 后的 TPOT",
      "steps": [
        { "id": "s1", "title": "首个 Token 输出", "description": "Prefill 结束后，首个输出 token 出现，TTFT 到此结束。", "highlightTargets": ["first-output-token"] },
        { "id": "s2", "title": "进入 Decode 循环", "description": "后续 token 逐步生成，体验从“等开口”变成“说得快不快”。", "highlightTargets": ["decode-loop"] },
        { "id": "s3", "title": "观察 TPOT 标尺", "description": "TPOT 衡量首 token 之后相邻输出 token 的平均间隔。", "highlightTargets": ["tpot"] },
        { "id": "s4", "title": "间隔变宽导致卡顿", "description": "并发、batch、显存带宽或 KV 读写压力会让 token 间隔变宽，流式输出像被卡住。", "highlightTargets": ["token-interval", "tpot"] },
        { "id": "s5", "title": "长输出累计等待", "description": "输出越长，TPOT 的小幅上升越会放大成完整答案的明显等待。", "highlightTargets": ["long-output", "total-latency"] }
      ]
    },
    "enterpriseCase": {
      "title": "代码助手首字很快但输出像挤牙膏",
      "scenario": "某研发平台的代码助手日均 9 万次补全，升级到更大模型后首字时间维持在 1.2 秒左右。",
      "problem": "开发者反馈响应开始后明显变慢，平均 TPOT 从 38ms 升到 115ms，长函数生成的 P95 完成时间增加 2.4 倍。",
      "analysis": "Prefill 优化和缓存仍有效，所以 TTFT 没有恶化；真正瓶颈在 Decode 阶段，模型更大、并发 batch 变深且 KV 读写压力增加。",
      "solution": "按任务分层路由短补全和长生成，限制低价值长输出；在灰度中对比 TPOT、吞吐、质量回归和成本，评估量化与投机解码收益。",
      "takeaway": "TPOT 是首字后体验的核心指标，不能被 TTFT 掩盖。"
    },
    "pitfalls": [
      "把 TTFT 和 TPOT 混成一个“延迟”，导致优化方向错误。",
      "只优化首字时间，却忽略长输出场景的完整等待。",
      "看到流式输出就认为体验一定好，实际 token 间隔过宽仍会卡顿。",
      "用扩容解决所有慢问题，不拆分 Decode、batch 和 KV 读写瓶颈。"
    ],
    "diagnosticQuestion": {
      "id": "q-tpot-1",
      "type": "single",
      "scenario": "代码助手首字时间稳定在 1 秒左右，但开始输出后每几个字停顿一次。监控显示输出 token 数相近，TPOT 从 40ms 升到 120ms，KV 命中率没有明显下降。",
      "question": "第一步应该优先看什么？",
      "options": [
        { "id": "a", "text": "Decode 阶段的并发 batch、显存带宽和模型版本变化" },
        { "id": "b", "text": "是否应把系统提示词缩短一半以降低 Prefill" },
        { "id": "c", "text": "是否需要提高 temperature 让模型输出更自然" },
        { "id": "d", "text": "是否应该只看端到端总耗时，避免过度拆指标" }
      ],
      "correctOptionIds": ["a"],
      "explanation": "A 直接对应 TPOT 上升和首字后卡顿。B 是强干扰项，缩短输入会改善 Prefill/TTFT，但题干显示首字稳定且 KV 命中没有下降。C 影响采样行为，不是性能第一排查。D 会掩盖 Prefill 与 Decode 的分工。",
      "troubleshootingPath": ["分离 TTFT、TPOT、输出 token 数和端到端完成时间", "按模型版本、并发、batch 和 GPU 实例拆分 TPOT", "查看 Decode 阶段 KV 读写、显存带宽和队列等待", "对长输出任务做路由和最大长度分层", "灰度评估量化、投机解码或调度策略对质量和 TPOT 的影响"],
      "relatedConceptIds": ["prefill", "decode", "ttft", "kv-cache", "batch-scheduling", "speculative-decoding", "quantization"]
    },
    "keyTakeaways": [
      "TTFT 回答“多久开始说”，TPOT 回答“说得快不快”。",
      "TPOT 主要反映 Decode 阶段体验。",
      "长输出场景必须同时看 TPOT 和输出 token 数。",
      "优化 TPOT 要联动模型、batch、KV Cache、硬件和解码策略。"
    ],
    "relatedConceptIds": ["prefill", "decode", "ttft", "kv-cache", "batch-scheduling", "speculative-decoding", "quantization"]
  },
  {
    "id": "session-affinity",
    "title": "Session 亲和",
    "slug": "session-affinity",
    "moduleId": "m2",
    "order": 6,
    "difficulty": "advanced",
    "estimatedMinutes": 10,
    "tags": ["Session 亲和", "KV Cache", "TTFT", "负载均衡", "MaaS"],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "Session 亲和是把同一会话或共享前缀请求尽量路由到可复用缓存域的策略，用来提升服务端缓存与状态局部性，而不是上下文连续性的来源。",
    "whyItMatters": "Session 亲和不是“粘住用户”这么简单，它主要优化 cache locality：让可复用的 KV Cache、前缀缓存或限流状态更容易命中。真正的上下文连续性仍来自应用层显式消息历史、任务状态、memory 和工具结果管理。平台侧要同时看 KV Cache 命中率、会话迁移率、可复用前缀比例、cache key 一致性、P99 TTFT、故障切换和租户隔离。",
    "mentalModel": "会话像一份正在办理的案卷。回到同一个柜台能减少重复翻材料，但案卷正文仍要由应用层携带或保存；如果材料本身没有共享前缀或缓存键不一致，只找同一柜台也复用不了笔记。",
    "mechanism": [
      "应用层先负责显式传入消息历史、任务状态、memory 和工具结果，保证语义上的上下文连续。",
      "推理服务只有在请求共享可缓存前缀、模型与 schema 一致、cache key 命中且缓存未过期时，才可能复用 KV 或前缀缓存。",
      "Session 亲和把这类请求尽量送回同一实例或缓存域，降低重复 Prefill 和首字等待。",
      "如果扩容、故障转移或负载均衡打散缓存域，KV 命中率下降会推高 TTFT，但不等于模型“忘记”了上下文。",
      "亲和策略必须与 TTL、缓存淘汰、cache key、租户隔离、热点迁移和降级路径一起设计。"
    ],
    "animation": {
      "type": "kv-cache",
      "title": "Session 亲和命中与打散重算",
      "steps": [
        { "id": "s1", "title": "同一会话进入实例", "description": "多轮请求携带 session id 和应用层上下文，路由层尝试回到同一缓存域。", "highlightTargets": ["session", "instance"] },
        { "id": "s2", "title": "首轮写入 KV Cache", "description": "首轮 Prefill 后，实例保存可缓存前缀的 K/V 笔记；能否复用取决于 shared prefix 与 cache key。", "highlightTargets": ["prefill", "kv-write"] },
        { "id": "s3", "title": "亲和命中复用缓存", "description": "后续请求命中同一缓存域且前缀匹配时，才可跳过共享部分计算，降低 TTFT。", "highlightTargets": ["cache-hit", "decode"] },
        { "id": "s4", "title": "路由打散导致未命中", "description": "扩容或负载均衡把请求打到空缓存实例，会重新 Prefill，但上下文是否连续仍由应用层状态决定。", "highlightTargets": ["route-miss", "cache-miss"] },
        { "id": "s5", "title": "过度亲和带来热点", "description": "长会话和热门租户会挤占显存，亲和策略还要处理容量、淘汰、租户隔离和容灾。", "highlightTargets": ["memory", "eviction"] }
      ]
    },
    "enterpriseCase": {
      "title": "多轮客服会话高峰期首字抖动",
      "scenario": "某 MaaS 平台承载 60 个业务应用，客服助手单日约 35 万轮对话，高峰期自动扩容。",
      "problem": "用户反馈同一会话前几轮很快，后几轮首字突然从 900ms 升到 4.5s；监控显示会话迁移率从 8% 升到 37%，KV 命中率下降到 22%。",
      "analysis": "扩容后负载均衡只按实例空闲度分配，没有识别可复用 shared prefix、session cache 和 cache key；部分限流状态也跟着实例变化，导致缓存收益和体验都不稳定。",
      "solution": "引入基于 session id、shared prefix 和 cache key 的缓存域路由，设置热点迁移阈值与亲和 TTL；扩容时预热热门前缀并监控迁移率、命中率和租户隔离。",
      "takeaway": "Session 亲和提升缓存局部性，但必须和应用层上下文、cache key、热点、容灾、限流一起治理。"
    },
    "pitfalls": [
      "把 Session 亲和理解成上下文记忆，而不是缓存和状态局部性。",
      "只追求亲和命中率，忽略热点实例和负载不均。",
      "扩缩容时不迁移或预热缓存，导致高峰期大量重算。",
      "会话状态、cache key、限流和缓存策略分别设计，出了问题难以复盘。"
    ],
    "diagnosticQuestion": {
      "id": "q-session-affinity-1",
      "type": "single",
      "scenario": "MaaS 平台扩容后，同一客服会话的 TTFT 波动明显。KV 命中率下降，会话迁移率上升，但 GPU 利用率并未持续打满。",
      "question": "最应该优先排查哪项？",
      "options": [
        { "id": "a", "text": "是否需要把所有请求固定到最空闲的实例" },
        { "id": "b", "text": "扩容后的 session 路由是否打散了可复用 shared prefix 或 session cache" },
        { "id": "c", "text": "是否应该提高输出 token 上限，让回答更完整" },
        { "id": "d", "text": "是否需要把 temperature 降到 0" }
      ],
      "correctOptionIds": ["b"],
      "explanation": "B 直接对应会话迁移率上升和 KV 命中下降，但排查前提是确认这些请求确实存在可复用 shared prefix、session cache 或 cache key。A 是强干扰项，按空闲实例分配看似均衡，却可能破坏缓存域。C 影响输出长度和 TPOT，不解决首字抖动。D 影响随机性，不解释缓存命中下降。",
      "troubleshootingPath": ["确认应用层是否显式传入消息历史、任务状态和工具结果", "确认是否存在可复用 shared prefix、session cache 或 prompt cache key", "按 session id 与 cache key 追踪连续请求落到哪些实例", "对比命中与未命中的 TTFT、Prefill 时长和缓存状态", "检查扩缩容、故障转移和负载均衡策略是否绕过缓存域", "设置亲和 TTL、迁移条件、缓存预热、租户隔离和故障降级"],
      "relatedConceptIds": ["kv-cache", "prefill", "ttft", "model-gateway", "rate-limit-circuit-break", "sla"]
    },
    "keyTakeaways": [
      "Session 亲和的核心价值是缓存和服务端状态局部性，不是替代应用层上下文。",
      "KV 或前缀缓存复用依赖 shared prefix、cache key、模型配置和服务实现。",
      "请求打散会带来重复 Prefill 与 TTFT 抖动，但不等于模型自动丢失上下文。",
      "平台要把会话迁移率、缓存命中率、可复用前缀比例和租户隔离一起看。"
    ],
    "relatedConceptIds": ["kv-cache", "prefill", "ttft", "model-gateway", "rate-limit-circuit-break", "sla"]
  },
  {
    "id": "batch-scheduling",
    "title": "Batch 调度",
    "slug": "batch-scheduling",
    "moduleId": "m2",
    "order": 7,
    "difficulty": "advanced",
    "estimatedMinutes": 11,
    "tags": ["Batch", "调度", "吞吐", "P99", "SLA"],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "Batch 调度是在推理服务中把多个请求组织成批处理，并在吞吐、延迟、公平性和稳定性之间做权衡的系统策略。",
    "whyItMatters": "Batch 决定 GPU 是否吃饱，也决定用户请求是否在队列里等太久。平台负责人看到的是吞吐、P99、排队时长、TPOT、超时率、租户公平性和成本；用户看到的是“有时很快、有时突然卡住”。Batch 调度出问题时，扩容不一定解决，因为瓶颈可能在队列策略、优先级、连续批处理或长短请求混排。",
    "mentalModel": "推理服务像一组电梯。一次只载一个人响应最快但浪费运力；等满一电梯再走吞吐高但有人会等很久。好的调度不是永远大 batch 或小 batch，而是按任务、SLA 和队列状态动态决定谁一起走、谁优先走、谁不能拖垮别人。",
    "mechanism": [
      "请求到达后先进入队列，调度器按时间窗、优先级和资源状态组成 batch。",
      "大 batch 能提高吞吐和 GPU 利用率，但会增加单个请求的等待和尾延迟风险。",
      "小 batch 响应更快，但吞吐低、成本高，GPU 可能空转。",
      "连续批处理会在 Decode 过程中动态加入新请求，改善吞吐但需要复杂的 KV 和队列管理。",
      "长输出、长输入和高优任务混排时，会互相影响 TTFT、TPOT、P99 和公平性。",
      "企业平台需要按租户、任务类型和 SLA 做隔离、优先级和超时策略。"
    ],
    "enterpriseCase": {
      "title": "知识库问答高峰期 P99 突然拉长",
      "scenario": "某企业 MaaS 平台服务 40 个内部应用，工作日上午知识库问答峰值达到每分钟 1.8 万请求。",
      "problem": "平均延迟只上升 18%，但 P99 从 6 秒升到 24 秒；投诉集中在客服和法务两个高优应用。",
      "analysis": "平台为了提高吞吐把 batch 等待窗口调大，低优批量摘要和高优问答混在同一队列；长输出任务占用 Decode，导致短请求排队。",
      "solution": "拆分在线问答和离线摘要队列，为高优应用设置最大等待时间和保底并发；启用动态 batch 上限，按 P99 和吞吐共同调参。",
      "takeaway": "Batch 调度不是单纯提高吞吐，而是 SLA、成本和公平性的权衡。"
    },
    "pitfalls": [
      "认为 batch 越大越好，只看吞吐不看 P99 和用户等待。",
      "看到 P99 高就盲目扩容，不检查队列等待和任务混排。",
      "所有租户共用一个队列，忽略高优应用和离线任务隔离。",
      "只看平均延迟，掩盖尾部用户长时间等待。",
      "调度策略上线后不按任务类型回放评测，导致局部收益、整体退化。"
    ],
    "diagnosticQuestion": {
      "id": "q-batch-scheduling-1",
      "type": "single",
      "scenario": "平台把 batch 等待窗口调大后，总吞吐提升 28%，但客服应用 P99 从 5 秒升到 19 秒。日志显示客服问答与低优批量摘要共享队列。",
      "question": "第一步最合理的处理是什么？",
      "options": [
        { "id": "a", "text": "继续增大 batch，让 GPU 利用率进一步提高" },
        { "id": "b", "text": "立即把所有请求都切到小 batch，牺牲吞吐换体验" },
        { "id": "c", "text": "按任务和 SLA 拆队列，限制高优请求最大等待，并观察 P99 与吞吐" },
        { "id": "d", "text": "只增加前端 loading 提示，降低用户焦虑" }
      ],
      "correctOptionIds": ["c"],
      "explanation": "C 同时处理任务混排、优先级和尾延迟。A 是强干扰项，吞吐更高可能继续恶化高优 P99。B 方向过猛，会让离线和低优任务成本失控，也不是第一步。D 只改善感知，不解决调度瓶颈。",
      "troubleshootingPath": ["拆分排队时间、Prefill、Decode 和输出 token 数", "按租户、任务类型和优先级统计 batch 组成", "查看长输入/长输出任务是否阻塞短请求", "设置队列隔离、最大等待时间和动态 batch 上限", "用 P50/P95/P99、吞吐和成本共同评估调度策略"],
      "relatedConceptIds": ["tpot", "ttft", "decode", "prefill", "session-affinity", "sla", "rate-limit-circuit-break"]
    },
    "keyTakeaways": [
      "Batch 调度是在吞吐、延迟和公平性之间做工程权衡。",
      "大 batch 不等于好体验，小 batch 不等于好成本。",
      "P99、排队时间和任务混排是调度排查重点。",
      "企业 MaaS 要按租户、任务类型和 SLA 做调度隔离。"
    ],
    "relatedConceptIds": ["tpot", "ttft", "decode", "prefill", "session-affinity", "sla", "rate-limit-circuit-break"]
  },
  {
    "id": "pd-separation",
    "title": "P-D 分离",
    "slug": "pd-separation",
    "moduleId": "m2",
    "order": 8,
    "difficulty": "advanced",
    "estimatedMinutes": 12,
    "tags": ["Prefill", "Decode", "P-D 分离", "推理架构", "KV Cache"],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "P-D 分离是把 Prefill 和 Decode 两类资源特征不同的推理负载拆开调度，以提升资源利用率、吞吐和稳定性。",
    "whyItMatters": "Prefill 更像大矩阵并行计算，Decode 更受逐 token 生成、KV 读写和串行性影响。把两者混在一组资源里，长上下文请求可能拖慢首字，长输出请求又可能占住 Decode。企业平台关心的是 TTFT、TPOT、GPU 利用率、KV 传输开销、队列长度和故障边界；P-D 分离能优化这些指标，但也会引入链路编排复杂度。",
    "mentalModel": "把推理工厂拆成“读材料车间”和“逐字产出车间”。读材料适合大批量并行，逐字产出需要稳定接力。两个车间分开后，各自更高效；但中间要搬运半成品，调度和故障定位也更难。",
    "mechanism": [
      "Prefill 处理完整输入上下文，计算密集且可并行，常影响 TTFT。",
      "Decode 按 token 逐步生成，更受 KV Cache 读写、显存带宽和输出长度影响。",
      "P-D 分离把 Prefill 请求和 Decode 请求放到不同资源池或调度队列中。",
      "分离后可为长输入和长输出分别配置资源、batch 和优先级，提高整体稳定性。",
      "代价是需要在阶段间传递 KV 或中间状态，并处理失败重试、路由一致和观测追踪。",
      "如果链路编排不清，故障会从单点性能问题变成跨池排查问题。"
    ],
    "enterpriseCase": {
      "title": "长文档问答拖慢短会话生成",
      "scenario": "某 MaaS 平台同时服务知识库问答和代码补全，每日约 260 万次请求，其中 15% 请求携带超长文档。",
      "problem": "长文档问答上线后，代码补全 TPOT 和 P99 明显波动；GPU 利用率看似很高，但短请求体验下降。",
      "analysis": "长输入请求在同一资源池占用 Prefill，长输出请求继续占用 Decode，两个阶段互相挤压；平台只有端到端延迟，缺少 Prefill/Decode 分段队列指标。",
      "solution": "把长输入 Prefill 迁入独立资源池，对 Decode 池设置短交互任务优先级；增加 KV 传输监控和跨池 trace。",
      "takeaway": "P-D 分离能提升稳定性，但必须补齐阶段间观测和回退策略。"
    },
    "pitfalls": [
      "认为 P-D 分离只是把服务拆成两个进程，忽略 KV 和路由编排。",
      "只看 GPU 利用率，不看 Prefill 队列、Decode 队列和阶段间等待。",
      "为所有应用统一启用 P-D 分离，不评估请求长度分布和收益。",
      "忽略失败重试和跨池 trace，导致故障定位更困难。"
    ],
    "diagnosticQuestion": {
      "id": "q-pd-separation-1",
      "type": "single",
      "scenario": "长文档问答上线后，短代码补全的 TPOT 和 P99 都变差。监控只有端到端延迟，无法区分 Prefill 排队和 Decode 排队。",
      "question": "最合理的第一步是什么？",
      "options": [
        { "id": "a", "text": "直接全量启用 P-D 分离，把所有请求拆到两个池" },
        { "id": "b", "text": "先补齐 Prefill/Decode 分段指标和请求长度分布，再评估分池与优先级策略" },
        { "id": "c", "text": "把长文档问答的 temperature 降低，减少输出随机性" },
        { "id": "d", "text": "只扩容当前统一推理池，避免架构复杂化" }
      ],
      "correctOptionIds": ["b"],
      "explanation": "B 先建立分段观测，再决定是否 P-D 分离和如何分池。A 是强干扰项，方向可能对，但在没有分段指标和长度分布前全量拆分风险很高。C 不解决资源阶段挤压。D 可能缓解总容量，但无法处理长短请求互相干扰和阶段差异。",
      "troubleshootingPath": ["为请求记录输入 token、输出 token、Prefill 队列、Decode 队列和阶段耗时", "按任务类型分析长输入与长输出对 TTFT/TPOT 的影响", "评估 Prefill 池和 Decode 池的资源配置与 KV 传输成本", "为短交互任务设置 Decode 优先级", "灰度验证 P99、吞吐、成本和故障恢复路径"],
      "relatedConceptIds": ["prefill", "decode", "tpot", "ttft", "kv-cache", "batch-scheduling", "observability"]
    },
    "keyTakeaways": [
      "Prefill 和 Decode 的资源特征不同，混跑会产生互相干扰。",
      "P-D 分离能改善利用率和稳定性，但不是免费优化。",
      "阶段间 KV 传输、路由和 trace 是落地难点。",
      "上线前必须先有分段指标和灰度回归。"
    ],
    "relatedConceptIds": ["prefill", "decode", "tpot", "ttft", "kv-cache", "batch-scheduling", "observability"]
  },
  {
    "id": "speculative-decoding",
    "title": "投机解码",
    "slug": "speculative-decoding",
    "moduleId": "m2",
    "order": 9,
    "difficulty": "advanced",
    "estimatedMinutes": 10,
    "tags": ["Speculative Decoding", "Decode", "TPOT", "草稿模型", "吞吐"],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "投机解码是用较小或较快的草稿模型先生成多个候选 token，再由目标大模型并行验证，从而在命中率高时加速 Decode。",
    "whyItMatters": "Decode 的逐 token 串行性会限制 TPOT。投机解码试图用“先草拟、再验证”的方式减少大模型逐步前进的次数。它主要影响 TPOT、吞吐和成本，但收益高度依赖草稿模型质量、接受率、验证成本、输出分布和系统实现。用户看到的是首字后输出更顺，或在命中低时反而更慢、更贵。",
    "mentalModel": "投机解码像让助理先写几句草稿，专家一次性快速审阅：如果草稿大多对，专家就能更快往前；如果草稿经常错，专家不但要审，还要重写，反而浪费时间。",
    "mechanism": [
      "草稿模型先根据当前上下文预测一串候选 token。",
      "目标大模型并行验证这些候选是否符合自己的分布。",
      "被接受的 token 可以一次性推进多个生成步，降低平均 TPOT。",
      "如果候选经常被拒绝，草稿计算和验证成本会抵消收益。",
      "接受率受任务类型、模型差距、采样策略、输出格式和领域分布影响。",
      "企业平台需要用线上回放评估质量、延迟、吞吐和成本，而不是只看理论加速比。"
    ],
    "enterpriseCase": {
      "title": "客服摘要开启投机解码后收益不稳定",
      "scenario": "某 MaaS 平台为客服对话摘要服务开启投机解码，日均 80 万次长输出请求。",
      "problem": "通用摘要任务 TPOT 降低 32%，但金融投诉摘要几乎无收益，部分批次成本反而上升 9%。",
      "analysis": "草稿模型在通用客服语料上接受率高，在金融投诉场景中术语、格式和合规措辞与目标模型差异大，候选 token 被频繁拒绝。",
      "solution": "按任务类型统计接受率、验证开销和质量回归；只在高接受率任务启用投机解码，低接受率场景改用模型路由或输出结构优化。",
      "takeaway": "投机解码不是让模型“猜答案”，而是系统级 Decode 加速策略，必须按任务分层启用。"
    },
    "pitfalls": [
      "认为投机解码会改变答案质量，本质上目标模型仍负责验证和接受。",
      "只看平均加速，不看接受率低的任务和 P99 退化。",
      "草稿模型越小越好，忽略候选质量下降带来的拒绝成本。",
      "全量启用，不按任务类型、输出格式和领域分布分层。",
      "把投机解码当成 TTFT 优化，忽略它主要作用于 Decode/TPOT。"
    ],
    "diagnosticQuestion": {
      "id": "q-speculative-decoding-1",
      "type": "single",
      "scenario": "平台给所有长输出任务开启投机解码。通用客服摘要变快，但金融投诉摘要 TPOT 基本不变，成本上升。日志显示候选 token 接受率很低。",
      "question": "最应该优先调整什么？",
      "options": [
        { "id": "a", "text": "把 max output tokens 提高，让投机解码有更多发挥空间" },
        { "id": "b", "text": "把温度提高，让草稿模型生成更多样候选" },
        { "id": "c", "text": "增加 Prefill 缓存，优先降低首字时延" },
        { "id": "d", "text": "按任务类型统计接受率和验证成本，只在高接受率场景启用或替换草稿模型" }
      ],
      "correctOptionIds": ["d"],
      "explanation": "D 直接处理接受率低导致收益消失的问题。A 会增加输出长度和成本，不保证接受率提升。B 可能让候选更偏离目标模型。C 优化 Prefill/TTFT，而题干是 Decode 加速收益不稳定。",
      "troubleshootingPath": ["按任务、模型版本和输出格式统计接受率", "拆分草稿生成成本、目标验证成本和实际 TPOT", "回放低接受率样本，判断是领域术语、格式还是采样策略导致", "为高接受率任务灰度启用，低接受率任务关闭或换草稿模型", "同步检查质量回归和成本变化"],
      "relatedConceptIds": ["decode", "tpot", "batch-scheduling", "quantization", "multi-model-routing", "eval"]
    },
    "keyTakeaways": [
      "投机解码用草稿模型提议 token，由目标模型验证。",
      "收益来自高接受率，不来自“猜得大胆”。",
      "它主要优化 Decode/TPOT，不是 Prefill 的替代方案。",
      "企业平台应按任务接受率、质量和成本分层启用。"
    ],
    "relatedConceptIds": ["decode", "tpot", "batch-scheduling", "quantization", "multi-model-routing", "eval"]
  },
  {
    "id": "quantization",
    "title": "量化",
    "slug": "quantization",
    "moduleId": "m2",
    "order": 10,
    "difficulty": "intermediate",
    "estimatedMinutes": 10,
    "tags": ["Quantization", "显存", "吞吐", "成本", "质量回归"],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "量化是用更低精度表示模型权重或激活，以降低显存和计算成本，并在质量可接受时提升部署密度和吞吐。",
    "whyItMatters": "企业平台常常不是“有没有模型”，而是“同样预算能承载多少请求、延迟是否稳定、质量是否回归”。量化会影响显存占用、吞吐、TPOT、硬件兼容和模型质量。用户看到的可能是响应更快、并发更稳，也可能是边界任务准确率下降、格式稳定性变差或多语言表现退化。",
    "mentalModel": "量化像把高清工程图压缩成更轻的版本。文件更小、传输和存储更省，但细节可能丢失。能不能用，不看压缩率本身，而看关键任务的质量细节有没有被压坏。",
    "mechanism": [
      "模型原本可能用 FP16/BF16 等较高精度表示权重和计算。",
      "量化把部分权重或激活转换成 INT8、INT4 等低精度表示，降低显存占用。",
      "显存占用下降后，同一硬件可部署更大模型或更多并发实例。",
      "不同量化策略对速度、显存、精度和硬件支持影响不同，不能只看位宽。",
      "质量风险常出现在数学、代码、长上下文、多语言和严格格式任务。",
      "上线必须做任务级质量回归、吞吐/TPOT 对比和异常样本抽检。"
    ],
    "enterpriseCase": {
      "title": "客服模型量化后成本下降但代码任务退化",
      "scenario": "某平台把 14B 模型从 FP16 切到 8-bit 量化，目标是在同样 GPU 集群上承载更多租户。",
      "problem": "客服问答吞吐提升 42%，显存占用下降约 35%；但代码解释任务的单元测试通过率从 86% 降到 78%，格式错误率上升。",
      "analysis": "量化对通用客服语义影响较小，但对代码细节、符号和格式边界更敏感；平台最初只看平均满意度和成本，没有按任务回归。",
      "solution": "按任务建立质量回归集，对客服默认启用量化模型，对代码、财务计算和高风险合规任务保留高精度或更严格灰度。",
      "takeaway": "量化是部署和成本策略，不是无损加速开关。"
    },
    "pitfalls": [
      "认为位宽越低越好，只看显存节省，不看质量回归。",
      "一次量化全平台上线，不按任务风险分层。",
      "只测平均问答质量，不测代码、数学、格式和长上下文边界。",
      "忽略硬件和推理框架支持，导致理论压缩没有转化为实际吞吐。",
      "把量化收益和 batch、缓存、路由收益混在一起，无法判断真实来源。"
    ],
    "diagnosticQuestion": {
      "id": "q-quantization-1",
      "type": "single",
      "scenario": "平台把多个应用切到 4-bit 量化模型后，平均成本下降，但代码生成任务的测试通过率下降，客服 FAQ 基本不受影响。",
      "question": "最合理的下一步是什么？",
      "options": [
        { "id": "a", "text": "继续全量推进量化，因为平均成本已经下降" },
        { "id": "b", "text": "只提高代码任务的 max output tokens，让模型补充更多解释" },
        { "id": "c", "text": "按任务风险做质量回归和路由分层，让敏感任务保留更高精度或灰度策略" },
        { "id": "d", "text": "把所有任务都改用更大 batch，提高吞吐抵消质量下降" }
      ],
      "correctOptionIds": ["c"],
      "explanation": "C 同时处理量化收益和任务质量差异。A 是强干扰项，平均成本不能覆盖代码任务退化。B 增加输出不会恢复量化丢失的边界精度，还可能增加成本。D 优化吞吐，不解决质量回归。",
      "troubleshootingPath": ["按任务类型比较量化前后的质量、格式错误、TPOT 和成本", "找出对精度敏感的代码、数学、合规和长上下文样本", "检查硬件和推理框架是否真正支持该量化策略", "为低风险任务启用量化，为高风险任务保留高精度或加灰度", "持续监控质量回归和成本收益"],
      "relatedConceptIds": ["tpot", "decode", "speculative-decoding", "multi-model-routing", "cost-routing", "eval"]
    },
    "keyTakeaways": [
      "量化用低精度换取显存、吞吐和部署密度。",
      "量化可能影响质量，尤其是边界和精细任务。",
      "企业平台要按任务做质量回归，而不是只看成本。",
      "量化收益必须结合硬件、框架和路由策略验证。"
    ],
    "relatedConceptIds": ["tpot", "decode", "speculative-decoding", "multi-model-routing", "cost-routing", "eval"]
  },
    {
        "id":  "maas",
        "title":  "MaaS",
        "slug":  "maas",
        "moduleId":  "m3",
        "order":  1,
        "difficulty":  "intermediate",
        "estimatedMinutes":  10,
        "tags":  [
                     "MaaS",
                     "模型平台",
                     "模型网关",
                     "计量",
                     "治理"
                 ],
        "contentStatus":  "mvp",
        "hasAnimation":  false,
        "definition":  "MaaS 是把模型能力封装为企业内部可接入、可治理、可计量的平台服务，让业务不再各自直连模型。",
        "whyItMatters":  "企业 AI 应用从试点走向规模化时，真正的挑战不是调用一次模型，而是让几十个业务稳定、合规、可观测地使用模型能力。MaaS 负责统一入口、模型目录、鉴权、配额、计量、评测、路由和审计，把分散调用变成平台能力。",
        "mentalModel":  "MaaS 像企业内部的模型能力电网。业务团队不用自己发电，但平台必须知道谁接入、用了多少、质量如何、故障时怎么降级以及成本归到哪里。",
        "mechanism":  [
                          "平台维护模型目录、版本、能力标签和使用边界，让业务知道哪些模型可以用于哪些场景。",
                          "业务通过统一 API、SDK 或网关接入模型能力，而不是各自直连供应商或自建推理服务。",
                          "鉴权、配额、限流、审计和成本计量在平台层统一执行，形成可治理的控制面。",
                          "路由层按任务、成本、SLA 和能力选择模型或服务池，避免所有请求落到单一默认模型。",
                          "观测和评测结果回流到模型选择、容量规划和治理策略，支撑后续优化。"
                      ],
        "enterpriseCase":  {
                               "title":  "20 个应用各自直连模型导致成本和审计失控",
                               "scenario":  "集团内客服、法务、研发和运营共 20 个应用接入 5 类模型，其中 8 个应用直连外部 API。",
                               "problem":  "月度模型成本无法按团队归因，安全审计只能覆盖约 60% 请求，模型版本变更也缺少统一记录。",
                               "analysis":  "缺统一模型目录、鉴权、计量和 trace，平台无法治理模型版本、数据边界和成本归属。",
                               "solution":  "建设 MaaS 入口，统一接入网关、模型目录、配额、Token 计量和审计链路；新应用必须通过平台申请模型能力。",
                               "takeaway":  "MaaS 的价值是把分散模型调用变成企业级平台能力。"
                           },
        "pitfalls":  [
                         "把 MaaS 理解成一个模型 API 代理，忽略目录、计量、审计和治理。",
                         "先堆模型数量，不建设接入、配额和成本归属能力。",
                         "只服务单个明星应用，忽略多租户、公平性和平台扩展。",
                         "没有模型版本和评测记录，导致线上变化不可追溯。"
                     ],
        "diagnosticQuestion":  {
                                   "id":  "q-maas-1",
                                   "type":  "single",
                                   "scenario":  "企业已有 15 个业务使用模型，其中 6 个直连外部 API，安全团队无法追踪敏感请求，财务也无法按部门归因成本。",
                                   "question":  "第一步最应该建设什么？",
                                   "options":  [
                                                   {
                                                       "id":  "a",
                                                       "text":  "统一 MaaS 接入入口，纳入鉴权、计量、审计和模型目录"
                                                   },
                                                   {
                                                       "id":  "b",
                                                       "text":  "先给所有应用换成最大模型"
                                                   },
                                                   {
                                                       "id":  "c",
                                                       "text":  "让每个业务自己补充日志字段"
                                                   },
                                                   {
                                                       "id":  "d",
                                                       "text":  "先扩大 GPU 集群，避免业务抱怨"
                                                   }
                                               ],
                                   "correctOptionIds":  [
                                                            "a"
                                                        ],
                                   "explanation":  "A 先建立平台控制面，能同时处理接入、计量和审计。B 和 D 只是扩大模型或资源，不解决治理。C 有帮助但仍是分散补丁，无法形成统一模型目录和成本归属。",
                                   "troubleshootingPath":  [
                                                               "梳理接入应用、模型来源和直连路径",
                                                               "收敛到统一 MaaS 入口",
                                                               "统一鉴权、配额和 Token 计量",
                                                               "接入 trace 与审计字段",
                                                               "按业务配置模型目录和成本归属"
                                                           ],
                                   "relatedConceptIds":  [
                                                             "model-gateway",
                                                             "multi-model-routing",
                                                             "cost-routing",
                                                             "capability-routing",
                                                             "rate-limit-circuit-break",
                                                             "sla"
                                                         ]
                               },
        "keyTakeaways":  [
                             "MaaS 是企业模型能力的平台化形态。",
                             "统一入口、计量和治理比模型数量更基础。",
                             "MaaS 应把成本、质量、安全和 SLA 纳入同一控制面。",
                             "MaaS 是模型网关、多模型路由和治理能力的承载层。"
                         ],
        "relatedConceptIds":  [
                                  "model-gateway",
                                  "multi-model-routing",
                                  "cost-routing",
                                  "capability-routing",
                                  "rate-limit-circuit-break",
                                  "sla"
                              ]
    },
    {
        "id":  "cost-routing",
        "title":  "成本路由",
        "slug":  "cost-routing",
        "moduleId":  "m3",
        "order":  4,
        "difficulty":  "advanced",
        "estimatedMinutes":  10,
        "tags":  [
                     "成本路由",
                     "Token ROI",
                     "多模型路由",
                     "SLA",
                     "Eval"
                 ],
        "contentStatus":  "mvp",
        "hasAnimation":  true,
        "definition":  "成本路由是在满足质量、时延和风险底线的前提下，把请求分配给成本合适的模型或服务池。",
        "whyItMatters":  "企业 AI 成本通常被少数高频、低价值或错误路由任务放大。成本路由不是简单选择便宜模型，而是在任务价值、质量门槛、SLA、失败代价和 Token 消耗之间做策略选择。",
        "mentalModel":  "成本路由像差旅审批。普通出差坐经济舱，高风险客户现场可以升级；规则不是永远最便宜，而是让花出去的钱匹配业务价值和风险。",
        "mechanism":  [
                          "请求先被打上任务类型、风险等级、质量要求、时延预算和预算归属。",
                          "路由策略根据标签筛选候选模型或推理服务，排除不满足质量底线的低成本选项。",
                          "低风险任务优先走低成本模型，高风险或失败代价高的任务走强模型。",
                          "评测和线上观测持续校准哪些任务能降级、哪些必须升级。",
                          "成本路由要记录 Token、模型版本、失败率和回退路径，避免只看账单。"
                      ],
        "animation":  {
                          "type":  "model-router",
                          "title":  "成本、质量与 SLA 的路由权衡",
                          "steps":  [
                                        {
                                            "id":  "s1",
                                            "title":  "请求带着成本与质量约束进入",
                                            "description":  "平台先识别任务类型、风险等级、预算归属和质量要求，而不是直接选择便宜模型。",
                                            "highlightTargets":  [
                                                                     "request-labels"
                                                                 ]
                                        },
                                        {
                                            "id":  "s2",
                                            "title":  "候选模型画像展开",
                                            "description":  "不同模型在能力、成本和时延上形成候选集合，低成本只是其中一个维度。",
                                            "highlightTargets":  [
                                                                     "model-profiles"
                                                                 ]
                                        },
                                        {
                                            "id":  "s3",
                                            "title":  "路由选择性价比模型",
                                            "description":  "在质量达标的前提下，路由优先选择成本更合适的模型或服务池。",
                                            "highlightTargets":  [
                                                                     "router",
                                                                     "selected-model"
                                                                 ]
                                        },
                                        {
                                            "id":  "s4",
                                            "title":  "失败或超 SLA 时升级",
                                            "description":  "当错误率、超时或质量不达标时，请求升级到更强模型或备用路由。",
                                            "highlightTargets":  [
                                                                     "fallback",
                                                                     "sla"
                                                                 ]
                                        },
                                        {
                                            "id":  "s5",
                                            "title":  "评测和观测回流策略",
                                            "description":  "回放评测和线上观测持续修正哪些任务可降级、哪些必须保留强模型。",
                                            "highlightTargets":  [
                                                                     "eval",
                                                                     "observability",
                                                                     "policy"
                                                                 ]
                                        }
                                    ]
                      },
        "enterpriseCase":  {
                               "title":  "客服摘要全部走旗舰模型导致成本暴涨",
                               "scenario":  "某客服平台月 180 万次摘要请求，默认全部路由到旗舰模型。",
                               "problem":  "两个月成本上涨 72%，但抽样评测发现 65% 低风险摘要用中模型即可达标。",
                               "analysis":  "平台没有任务分层和质量底线，只按一个默认模型服务所有请求，低价值任务吞掉了大量预算。",
                               "solution":  "建立摘要、投诉、合规三类任务标签，用 1 万条历史请求回放评测；低风险走中模型，高风险失败时升级旗舰。",
                               "takeaway":  "成本路由要先定义质量底线，再谈省钱。"
                           },
        "pitfalls":  [
                         "把成本路由等同于永远选择最便宜模型。",
                         "没有评测集就直接把大比例请求切到低价模型。",
                         "只看平均成本下降，不看失败率和人工返工。",
                         "忽略 Token 长度，导致长输入低价值任务吞掉预算。",
                         "没有回退策略，低成本模型失败后影响 SLA。"
                     ],
        "diagnosticQuestion":  {
                                   "id":  "q-cost-routing-1",
                                   "type":  "single",
                                   "scenario":  "MaaS 平台月成本上涨 70%，团队计划把 80% 请求直接切到便宜模型，但当前没有任务分类和质量回放结果。",
                                   "question":  "最优先的动作是什么？",
                                   "options":  [
                                                   {
                                                       "id":  "a",
                                                       "text":  "立刻全量切换低成本模型"
                                                   },
                                                   {
                                                       "id":  "b",
                                                       "text":  "建立任务分层和回放评测，先找出可降级且质量达标的请求"
                                                   },
                                                   {
                                                       "id":  "c",
                                                       "text":  "只提高缓存时间，避免模型调用"
                                                   },
                                                   {
                                                       "id":  "d",
                                                       "text":  "先购买更多低价模型额度"
                                                   }
                                               ],
                                   "correctOptionIds":  [
                                                            "b"
                                                        ],
                                   "explanation":  "B 先确定质量底线和可降级范围。A 和 D 是强干扰项，看似能省钱，但会带来质量和 SLA 风险。C 只能处理重复请求，不解决模型选择策略。",
                                   "troubleshootingPath":  [
                                                               "按任务、团队和 Token 消耗拆账单",
                                                               "建立回放评测集和质量底线",
                                                               "识别可降级任务与不可降级任务",
                                                               "灰度低成本路由策略",
                                                               "监控失败率、成本和人工返工"
                                                           ],
                                   "relatedConceptIds":  [
                                                             "maas",
                                                             "model-gateway",
                                                             "multi-model-routing",
                                                             "capability-routing",
                                                             "token-roi",
                                                             "eval",
                                                             "sla"
                                                         ]
                               },
        "keyTakeaways":  [
                             "成本路由的前提是质量和 SLA 底线。",
                             "可降级任务必须由评测和线上观测证明。",
                             "账单要按任务、模型、Token 和团队拆分。",
                             "成本优化必须保留升级和回退路径。"
                         ],
        "relatedConceptIds":  [
                                  "maas",
                                  "model-gateway",
                                  "multi-model-routing",
                                  "capability-routing",
                                  "token-roi",
                                  "eval",
                                  "sla"
                              ]
    },
    {
        "id":  "capability-routing",
        "title":  "能力路由",
        "slug":  "capability-routing",
        "moduleId":  "m3",
        "order":  5,
        "difficulty":  "advanced",
        "estimatedMinutes":  10,
        "tags":  [
                     "能力路由",
                     "模型能力",
                     "工具调用",
                     "Repo Context",
                     "Eval"
                 ],
        "contentStatus":  "mvp",
        "hasAnimation":  true,
        "definition":  "能力路由是根据任务需要的推理、代码、工具、长上下文、多模态或合规能力，把请求分配给真正胜任的模型或链路。",
        "whyItMatters":  "企业平台不能只按模型大小选路由。一个便宜模型可能足够做摘要，却不适合多文件代码修改；一个强模型可能会浪费在简单分类上。能力路由让平台按任务需求选择能力，而不是按品牌或默认配置选择模型。",
        "mentalModel":  "能力路由像派工单。修水管、审合同和写代码需要不同技工；派最贵的人做所有事浪费，派错人做关键事会返工。",
        "mechanism":  [
                          "请求进入平台后先识别任务类型、输入形态、工具需求和风险等级。",
                          "模型或链路需要维护能力标签，例如长上下文、代码、结构化输出、工具调用和合规拒答。",
                          "路由策略把任务需求与能力标签匹配，过滤不达标候选。",
                          "对复杂任务保留升级、重试或人工审核路径。",
                          "评测集和线上 trace 用于修正能力标签，避免凭经验维护路由。"
                      ],
        "animation":  {
                          "type":  "model-router",
                          "title":  "按任务能力选择模型链路",
                          "steps":  [
                                        {
                                            "id":  "s1",
                                            "title":  "识别任务能力要求",
                                            "description":  "请求被标注为代码修复、合同审查、摘要或 FAQ 等不同任务，并带上上下文、工具和风险要求。",
                                            "highlightTargets":  [
                                                                     "request-labels"
                                                                 ]
                                        },
                                        {
                                            "id":  "s2",
                                            "title":  "候选模型能力画像",
                                            "description":  "不同候选模型在能力、成本和时延上差异明显，不能只看价格或默认模型。",
                                            "highlightTargets":  [
                                                                     "model-profiles"
                                                                 ]
                                        },
                                        {
                                            "id":  "s3",
                                            "title":  "过滤不达标候选",
                                            "description":  "路由策略过滤掉不支持关键能力的候选，例如缺少代码和工具链能力的小模型。",
                                            "highlightTargets":  [
                                                                     "router",
                                                                     "selected-model"
                                                                 ]
                                        },
                                        {
                                            "id":  "s4",
                                            "title":  "失败时升级或人工兜底",
                                            "description":  "复杂任务如果出现错误率或超时，平台升级到更强链路或触发人工审核。",
                                            "highlightTargets":  [
                                                                     "fallback",
                                                                     "sla"
                                                                 ]
                                        },
                                        {
                                            "id":  "s5",
                                            "title":  "用评测和观测修正能力标签",
                                            "description":  "评测集和线上 trace 回流到路由策略，持续校准模型能力标签。",
                                            "highlightTargets":  [
                                                                     "eval",
                                                                     "observability",
                                                                     "policy"
                                                                 ]
                                        }
                                    ]
                      },
        "enterpriseCase":  {
                               "title":  "代码修复任务被路由到摘要模型",
                               "scenario":  "研发平台同时提供会议摘要、知识问答和代码修复能力。",
                               "problem":  "15% 代码修复请求被路由到通用摘要模型，PR 验证失败率达到 38%。",
                               "analysis":  "路由只看成本和平均延迟，没有识别仓库上下文、工具调用和测试能力需求。",
                               "solution":  "新增任务识别、能力标签和代码任务评测集；代码修复默认走具备 repo-context 和工具调用能力的链路，失败时升级人工。",
                               "takeaway":  "能力路由要用任务能力要求约束模型选择。"
                           },
        "pitfalls":  [
                         "认为大模型能力最强，所以可以覆盖所有任务。",
                         "只按成本或延迟路由，不看任务需要的能力。",
                         "能力标签靠人工印象维护，没有评测和 trace 回流。",
                         "忽略工具、上下文和结构化输出能力，把它们都归为模型能力。",
                         "没有不确定时的升级和人工审核策略。"
                     ],
        "diagnosticQuestion":  {
                                   "id":  "q-capability-routing-1",
                                   "type":  "single",
                                   "scenario":  "平台把合同审查、FAQ 和代码修复都按成本优先路由。最近代码修复失败率升到 38%，日志显示很多请求没有加载仓库上下文和测试工具。",
                                   "question":  "最应该补哪项能力？",
                                   "options":  [
                                                   {
                                                       "id":  "a",
                                                       "text":  "把所有任务都切到旗舰模型"
                                                   },
                                                   {
                                                       "id":  "b",
                                                       "text":  "把低价模型并发调高"
                                                   },
                                                   {
                                                       "id":  "c",
                                                       "text":  "建立任务识别与能力标签，让代码修复走支持仓库上下文和工具调用的链路"
                                                   },
                                                   {
                                                       "id":  "d",
                                                       "text":  "缩短系统提示词，降低首字时间"
                                                   }
                                               ],
                                   "correctOptionIds":  [
                                                            "c"
                                                        ],
                                   "explanation":  "C 对准任务能力不匹配。A 是强干扰项，可能缓解部分问题但仍可能缺工具链且成本高。B 和 D 优化性能，不解决能力路由错误。",
                                   "troubleshootingPath":  [
                                                               "按任务类型统计失败率",
                                                               "检查路由标签和候选模型能力",
                                                               "补能力矩阵和任务识别",
                                                               "回放代码任务评测",
                                                               "灰度新策略并监控验证失败率"
                                                           ],
                                   "relatedConceptIds":  [
                                                             "maas",
                                                             "multi-model-routing",
                                                             "cost-routing",
                                                             "tool-calling",
                                                             "repo-context",
                                                             "eval",
                                                             "trace"
                                                         ]
                               },
        "keyTakeaways":  [
                             "能力路由按任务需求选链路，不按模型名选链路。",
                             "能力包括模型、工具、上下文、格式和治理约束。",
                             "能力标签必须由评测和 trace 持续校准。",
                             "复杂任务需要升级和人审兜底。"
                         ],
        "relatedConceptIds":  [
                                  "maas",
                                  "multi-model-routing",
                                  "cost-routing",
                                  "tool-calling",
                                  "repo-context",
                                  "eval",
                                  "trace"
                              ]
    },
    {
        "id":  "cache-system",
        "title":  "缓存体系",
        "slug":  "cache-system",
        "moduleId":  "m3",
        "order":  6,
        "difficulty":  "advanced",
        "estimatedMinutes":  11,
        "tags":  [
                     "缓存体系",
                     "语义缓存",
                     "RAG 缓存",
                     "KV Cache",
                     "Trace"
                 ],
        "contentStatus":  "mvp",
        "hasAnimation":  false,
        "definition":  "缓存体系是在 AI 平台中复用可安全复用的输入、上下文、结果或中间状态，以降低成本、延迟和重复计算。",
        "whyItMatters":  "AI 应用的缓存不只是普通 HTTP 缓存。提示词、RAG 片段、语义相似问题、模型结果、前缀和 KV Cache 都可能被复用，但复用错误会产生过期答案、权限泄漏或错误扩散。",
        "mentalModel":  "缓存体系像办公室里的资料夹。常用资料放手边能省时间，但如果资料过期、拿错权限或把别人的批注复用到你的报告里，效率就会变成事故。",
        "mechanism":  [
                          "平台先识别可缓存对象：静态提示词、检索结果、语义相似请求、模型输出、前缀或 KV 状态。",
                          "不同缓存有不同命中条件：精确匹配、语义相似、用户权限、模型版本、时间窗口和上下文边界。",
                          "缓存命中可降低 TTFT、TPOT、Token 成本或下游系统压力。",
                          "缓存必须有失效、隔离和审计策略，避免复用过期或越权内容。",
                          "命中率、节省 Token、错误复用率和回源成本要一起监控。"
                      ],
        "enterpriseCase":  {
                               "title":  "语义缓存命中率高但投诉增加",
                               "scenario":  "客服平台为 FAQ 问答启用语义缓存，日均 50 万次请求。",
                               "problem":  "缓存命中率达到 42%，模型成本下降 28%，但政策类问题投诉率上升，部分答案引用了旧规则。",
                               "analysis":  "缓存只按语义相似命中，没有绑定知识库版本、用户地区和政策生效时间。",
                               "solution":  "将缓存 key 加入知识库版本、地区、租户和有效期；高风险政策问题改为短 TTL 并强制回源验证。",
                               "takeaway":  "缓存收益必须和正确性、权限和时效一起治理。"
                           },
        "pitfalls":  [
                         "只追求命中率，不看错误复用率。",
                         "把所有相似问题都缓存，不绑定权限、版本和时间。",
                         "混淆结果缓存、语义缓存、RAG 缓存和 KV Cache。",
                         "缓存命中后不保留 trace，无法解释答案来源。",
                         "缓存策略不上线灰度，一次影响所有租户。"
                     ],
        "diagnosticQuestion":  {
                                   "id":  "q-cache-system-1",
                                   "type":  "single",
                                   "scenario":  "语义缓存上线后成本下降 25%，但合规问答出现旧政策答案。缓存命中日志没有记录知识库版本和地区。",
                                   "question":  "优先修复什么？",
                                   "options":  [
                                                   {
                                                       "id":  "a",
                                                       "text":  "把缓存 TTL 调到更长，提高命中率"
                                                   },
                                                   {
                                                       "id":  "b",
                                                       "text":  "全部关闭缓存，避免任何风险"
                                                   },
                                                   {
                                                       "id":  "c",
                                                       "text":  "把所有问题都改用旗舰模型"
                                                   },
                                                   {
                                                       "id":  "d",
                                                       "text":  "将缓存 key 和失效策略绑定知识库版本、租户/地区、权限和有效期，并监控错误复用"
                                                   }
                                               ],
                                   "correctOptionIds":  [
                                                            "d"
                                                        ],
                                   "explanation":  "D 处理错误复用根因。A 会放大过期风险。B 可临时止血但不是体系化方案。C 不解决缓存命中复用旧答案的问题。",
                                   "troubleshootingPath":  [
                                                               "定位错误命中的缓存类型",
                                                               "检查 cache key 组成",
                                                               "补知识版本、租户和权限隔离",
                                                               "设置风险分级 TTL",
                                                               "监控命中率与错误复用率"
                                                           ],
                                   "relatedConceptIds":  [
                                                             "kv-cache",
                                                             "session-affinity",
                                                             "model-gateway",
                                                             "maas",
                                                             "trace",
                                                             "observability",
                                                             "permission-governance"
                                                         ]
                               },
        "keyTakeaways":  [
                             "AI 缓存要同时治理命中率、正确性、权限和时效。",
                             "不同缓存层解决不同瓶颈，不能混为一谈。",
                             "缓存 key 必须纳入模型、知识、租户和风险边界。",
                             "高风险任务宁可少命中，也不能错误复用。"
                         ],
        "relatedConceptIds":  [
                                  "kv-cache",
                                  "session-affinity",
                                  "model-gateway",
                                  "maas",
                                  "trace",
                                  "observability",
                                  "permission-governance"
                              ]
    },
    {
        "id":  "rate-limit-circuit-break",
        "title":  "限流熔断",
        "slug":  "rate-limit-circuit-break",
        "moduleId":  "m3",
        "order":  7,
        "difficulty":  "intermediate",
        "estimatedMinutes":  10,
        "tags":  [
                     "限流",
                     "熔断",
                     "降级",
                     "SLA",
                     "网关"
                 ],
        "contentStatus":  "mvp",
        "hasAnimation":  false,
        "definition":  "限流熔断是在模型平台过载、下游故障或租户异常时，通过配额、排队、拒绝、降级和备用路由保护整体服务稳定性的机制。",
        "whyItMatters":  "模型服务成本高、延迟敏感、依赖链长。没有限流熔断，一个异常租户、一次活动流量或外部模型故障，就可能拖垮整个平台，让关键业务和低优先级请求一起失败。",
        "mentalModel":  "限流熔断像医院分诊。不是所有人同时冲进急诊室，而是按优先级、容量和风险分流；设备异常时先保护重症通道，再安排其他人等待或转诊。",
        "mechanism":  [
                          "平台按租户、应用、模型、任务和优先级设置配额与速率限制。",
                          "队列长度、错误率、超时率、P99 和下游健康状态触发保护策略。",
                          "限流可以拒绝、排队、降级模型、缩短输出或转备用服务。",
                          "熔断用于快速隔离持续失败的模型、供应商或工具链，避免级联故障。",
                          "恢复需要半开探测、灰度放量和观测确认，不能故障一消失就全量恢复。"
                      ],
        "enterpriseCase":  {
                               "title":  "营销活动压垮共享模型池",
                               "scenario":  "某平台平时每分钟 2 万请求，营销活动峰值冲到 9 万请求，和客服、风控共用同一模型池。",
                               "problem":  "P99 从 3 秒升到 18 秒，客服超时率达到 22%，外部供应商同时出现 5xx 抖动。",
                               "analysis":  "平台没有租户优先级和活动配额，外部模型错误未及时熔断，低优先级流量挤占关键业务。",
                               "solution":  "按业务等级设置配额和队列上限，营销流量降级到低成本模型；供应商 5xx 超阈值后熔断并切备用路由。",
                               "takeaway":  "限流熔断的目标是保护整体 SLA，而不是单纯拒绝请求。"
                           },
        "pitfalls":  [
                         "认为限流就是简单返回错误。",
                         "所有租户共用一个队列，关键业务和试验流量互相影响。",
                         "下游持续 5xx 仍不断重试，造成级联故障。",
                         "没有半开恢复策略，故障后要么一直熔断，要么突然全量恢复。",
                         "只看平均延迟，不看 P99、队列长度和租户公平性。"
                     ],
        "diagnosticQuestion":  {
                                   "id":  "q-rate-limit-circuit-break-1",
                                   "type":  "single",
                                   "scenario":  "活动期间平台请求量涨到平时 4 倍，客服应用 P99 升到 18 秒。日志显示某低优先级营销应用占用 55% 队列，外部模型 5xx 也明显上升。",
                                   "question":  "第一步最应该做什么？",
                                   "options":  [
                                                   {
                                                       "id":  "a",
                                                       "text":  "立刻给所有模型池扩容"
                                                   },
                                                   {
                                                       "id":  "b",
                                                       "text":  "按租户优先级限流营销流量，并对异常外部模型触发熔断/备用路由"
                                                   },
                                                   {
                                                       "id":  "c",
                                                       "text":  "提高 temperature，让模型更快输出"
                                                   },
                                                   {
                                                       "id":  "d",
                                                       "text":  "删除所有队列，直接并发请求下游"
                                                   }
                                               ],
                                   "correctOptionIds":  [
                                                            "b"
                                                        ],
                                   "explanation":  "B 同时处理低优先级挤占和下游故障。A 是强干扰项，扩容慢且不隔离故障。C 与性能保护无关。D 会放大过载和下游失败。",
                                   "troubleshootingPath":  [
                                                               "按租户拆分队列、P99 和错误率",
                                                               "确认下游模型或供应商健康状态",
                                                               "启用优先级限流和队列上限",
                                                               "对异常下游熔断并切备用路由",
                                                               "半开探测恢复并观察关键业务 SLA"
                                                           ],
                                   "relatedConceptIds":  [
                                                             "model-gateway",
                                                             "maas",
                                                             "session-affinity",
                                                             "batch-scheduling",
                                                             "sla",
                                                             "observability"
                                                         ]
                               },
        "keyTakeaways":  [
                             "限流熔断保护的是平台整体稳定性和关键业务 SLA。",
                             "队列、配额和优先级必须按租户和任务分层。",
                             "下游故障要快速隔离，避免重试风暴。",
                             "恢复需要半开和灰度，不应瞬间全量放开。"
                         ],
        "relatedConceptIds":  [
                                  "model-gateway",
                                  "maas",
                                  "session-affinity",
                                  "batch-scheduling",
                                  "sla",
                                  "observability"
                              ]
    },
    {
        "id":  "sla",
        "title":  "SLA 保障",
        "slug":  "sla",
        "moduleId":  "m3",
        "order":  8,
        "difficulty":  "intermediate",
        "estimatedMinutes":  10,
        "tags":  [
                     "SLA",
                     "可用性",
                     "P95",
                     "质量指标",
                     "降级"
                 ],
        "contentStatus":  "mvp",
        "hasAnimation":  false,
        "definition":  "SLA 保障是把模型平台的可用性、延迟、错误率、质量和降级策略定义为可承诺、可监控、可复盘的服务目标。",
        "whyItMatters":  "企业用户不会只问模型能不能回答，而会问关键业务是否稳定可用。SLA 把平台责任从最好努力变成明确承诺：哪些任务要 P95 低于多少、可用性多少、失败怎么降级、质量如何评估、事故如何复盘。",
        "mentalModel":  "SLA 像服务合同。它不是一句保证稳定，而是写清楚交付指标、例外情况、补救手段和责任边界。",
        "mechanism":  [
                          "平台按业务等级定义可用性、P95/P99、错误率、超时率和质量底线。",
                          "指标必须拆到模型、网关、队列、RAG、工具和外部供应商等链路段。",
                          "降级策略包括模型切换、缓存兜底、缩短输出、关闭非关键能力和人工升级。",
                          "SLA 需要告警、值班、事故分级和复盘机制支撑。",
                          "质量类 SLA 依赖 Eval、Trace 和线上抽检，不只看 HTTP 成功率。"
                      ],
        "enterpriseCase":  {
                               "title":  "合同审核助手 HTTP 成功但业务 SLA 失败",
                               "scenario":  "法务平台给 300 名合同经理提供审核助手，承诺工作时间可用性 99.5%、P95 首字 3 秒内、关键条款漏检率低于 2%。",
                               "problem":  "HTTP 成功率 99.8%，但 P95 TTFT 多次超过 7 秒，抽检发现关键条款漏检率 5.6%。",
                               "analysis":  "平台只监控接口成功率，没有把质量和关键路径延迟纳入 SLA，也没有降级到规则库和人工复核。",
                               "solution":  "建立链路指标、质量抽检、失败升级和降级策略；高风险合同触发人工复核，普通合同使用缓存和中模型分流。",
                               "takeaway":  "AI SLA 必须同时覆盖技术可用性、体验延迟和业务质量。"
                           },
        "pitfalls":  [
                         "把 SLA 等同于 HTTP 200 成功率。",
                         "只承诺平均延迟，不看 P95/P99 和关键任务。",
                         "没有质量指标，导致模型回答错误也算成功。",
                         "降级策略临时手工处理，没有预案和演练。",
                         "不区分业务等级，对所有请求承诺同一指标。"
                     ],
        "diagnosticQuestion":  {
                                   "id":  "q-sla-1",
                                   "type":  "single",
                                   "scenario":  "合同审核助手 HTTP 成功率 99.8%，但法务投诉高风险合同漏检，P95 首字也从 2.5 秒升到 7 秒。当前 SLA 只写接口可用性。",
                                   "question":  "最应该补充什么？",
                                   "options":  [
                                                   {
                                                       "id":  "a",
                                                       "text":  "只把可用性目标从 99.5% 提高到 99.9%"
                                                   },
                                                   {
                                                       "id":  "b",
                                                       "text":  "把所有请求都切到旗舰模型"
                                                   },
                                                   {
                                                       "id":  "c",
                                                       "text":  "在 SLA 中加入关键链路延迟、质量抽检指标、降级/人工复核策略和事故复盘"
                                                   },
                                                   {
                                                       "id":  "d",
                                                       "text":  "关闭 trace，减少日志成本"
                                                   }
                                               ],
                                   "correctOptionIds":  [
                                                            "c"
                                                        ],
                                   "explanation":  "C 覆盖体验和质量两个缺口。A 只提高 HTTP 目标，不能解决漏检和首字变慢。B 是强干扰项，可能增慢且不保证质量。D 会削弱排查和复盘能力。",
                                   "troubleshootingPath":  [
                                                               "拆分技术成功率、TTFT/P99 和质量指标",
                                                               "定义业务等级和任务成功标准",
                                                               "补质量评测和线上抽检",
                                                               "设计降级与人工升级",
                                                               "建立事故复盘与 SLA 调整机制"
                                                           ],
                                   "relatedConceptIds":  [
                                                             "maas",
                                                             "model-gateway",
                                                             "multi-model-routing",
                                                             "rate-limit-circuit-break",
                                                             "eval",
                                                             "trace",
                                                             "observability"
                                                         ]
                               },
        "keyTakeaways":  [
                             "AI SLA 要覆盖可用性、延迟、错误率和业务质量。",
                             "HTTP 成功不等于用户任务成功。",
                             "SLA 必须配套降级、告警、值班和复盘。",
                             "不同业务等级应有不同承诺和成本策略。"
                         ],
        "relatedConceptIds":  [
                                  "maas",
                                  "model-gateway",
                                  "multi-model-routing",
                                  "rate-limit-circuit-break",
                                  "eval",
                                  "trace",
                                  "observability"
                              ]
    },
{
  "id": "prompt-context",
  "title": "Prompt 与 Context",
  "slug": "prompt-context",
  "moduleId": "m4",
  "order": 1,
  "difficulty": "basic",
  "estimatedMinutes": 9,
  "tags": [
    "Prompt",
    "Context",
    "上下文工程",
    "Agent"
  ],
  "contentStatus": "mvp",
  "hasAnimation": false,
  "definition": "Prompt 是一次调用中表达任务意图的提示内容，Context 是模型当轮可见的全部材料；系统提示词、用户问题、历史消息、检索片段和工具结果都属于 Context，其中一部分也同时是 Prompt。",
  "whyItMatters": "很多 AI 应用问题并不是模型不会，而是上下文里放错、放少或放乱了信息。企业应用要稳定，不能只打磨一句提示词，还要治理哪些信息进入窗口、顺序如何、证据是否可信、过期信息如何清理。",
  "mentalModel": "把 Prompt 看成一次任务的指令单，把 Context 看成模型桌面上摊开的全部材料。指令再清楚，如果桌面上混着旧版本政策、无关聊天和错误检索片段，执行结果仍会偏离目标。",
  "mechanism": [
    "系统提示、开发者指令、用户问题、历史消息、RAG 片段和工具返回会共同组成模型可见上下文。",
    "模型不会天然区分哪些信息权威、哪些只是噪音，应用需要通过层级、顺序、标签和裁剪策略表达优先级。",
    "Prompt 负责声明目标、角色、约束和输出格式，Context 负责提供完成任务所需的事实、状态和证据。",
    "系统提示词既是 Prompt 的一类，也是 Context 的组成部分；本讲区分二者，是为了强调“指令”和“材料”的治理重点不同。",
    "工程上需要记录每次请求的上下文构成，才能复盘质量问题而不是只改提示词。"
  ],
  "enterpriseCase": {
    "title": "客服助手提示词正确但引用旧政策",
    "scenario": "一家 SaaS 公司将 8 个产品线的客服助手接入知识库，每月约 18 万次对话，系统提示要求只能引用当前生效政策。",
    "problem": "上线后一周内，退款类回答准确率从 91% 降到 76%，抽样发现 24% 错答引用了三个月前的旧政策片段。",
    "analysis": "团队只检查了 Prompt，没有检查 Context 构成；检索结果中旧政策和新政策同时进入窗口，且没有生效日期和权威级标签。",
    "solution": "为上下文增加来源、版本、生效日期和业务线标签，检索阶段过滤过期文档，并在 trace 中记录每轮进入窗口的片段。",
    "takeaway": "Prompt 决定任务意图，Context 决定模型实际依据；两者必须一起治理。"
  },
  "pitfalls": [
    "把 Prompt 优化当成全部上下文工程。",
    "只追加更多材料，不处理权威性、时效性和冲突。",
    "让历史对话无限累积，导致旧目标污染新任务。",
    "线上只记录最终回答，不记录进入模型的上下文。"
  ],
  "diagnosticQuestion": {
    "id": "q-prompt-context-1",
    "type": "single",
    "scenario": "客服助手系统提示写明只能引用最新政策，但退款问题仍频繁引用旧条款。抽样 trace 显示新旧政策片段同时进入模型窗口，旧片段排序更靠前。",
    "question": "第一步应该做什么？",
    "options": [
      {
        "id": "a",
        "text": "先核对政策版本、排序、来源权威级和生效状态"
      },
      {
        "id": "b",
        "text": "先重写系统提示，要求引用政策生效日期"
      },
      {
        "id": "c",
        "text": "先扩大退款知识库召回数量、重建索引并观察命中率"
      },
      {
        "id": "d",
        "text": "先把退款意图全量转人工、等待旧政策页面统一下线"
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "A 是第一步，因为 trace 已显示新旧政策同时进入窗口，必须先核对版本、排序、来源权威级和生效状态。B 能加强输出约束，但不能定位错误片段为什么进入上下文。C 可能扩大召回噪音。D 是临时止血，不是根因修复。",
    "troubleshootingPath": [
      "查看实际进入模型的上下文",
      "核对材料版本、生效时间和来源权威级",
      "调整检索过滤与排序策略",
      "补充 trace 字段以便持续复盘",
      "再评估 Prompt 是否需要简化或补充约束"
    ],
    "relatedConceptIds": [
      "context-window",
      "context-compression",
      "context-pollution",
      "system-prompt",
      "agent-loop"
    ]
  },
  "keyTakeaways": [
    "Prompt 是指令，Context 是模型实际可见的工作材料。",
    "上下文质量决定模型依据，不能只靠提示词补救。",
    "上下文治理要覆盖来源、版本、优先级、裁剪和 trace。"
  ],
  "relatedConceptIds": [
    "context-window",
    "context-compression",
    "context-pollution",
    "system-prompt",
    "agent-loop"
  ]
},
{
  "id": "system-prompt",
  "title": "系统提示词",
  "slug": "system-prompt",
  "moduleId": "m4",
  "order": 2,
  "difficulty": "basic",
  "estimatedMinutes": 8,
  "tags": [
    "System Prompt",
    "安全边界",
    "角色约束",
    "上下文工程"
  ],
  "contentStatus": "mvp",
  "hasAnimation": false,
  "definition": "系统提示词是在用户输入之前注入的高优先级指令，用来定义应用身份、任务边界、安全约束、输出规则和升级条件。",
  "whyItMatters": "企业 AI 应用不能把关键规则交给用户临时描述。系统提示词把产品边界、合规要求和工作流约束固化到每次调用中，是让同一个模型在不同业务场景中表现稳定的基础。",
  "mentalModel": "系统提示词更像岗位说明和操作规程，不是给模型的口号。它应该告诉模型什么任务能做、什么不能做、遇到不确定时怎么升级，而不是堆满形容词。",
  "mechanism": [
    "系统提示词通常位于上下文最高优先级位置，用来声明角色、目标、禁止事项和输出格式。",
    "它需要和产品权限、工具白名单、数据范围、审计要求配套，否则文字约束容易被运行时链路绕开。",
    "好的系统提示词会包含拒答、澄清、引用证据和人工升级规则。",
    "系统提示词应按应用版本管理，并和线上评测、trace、事故复盘关联。",
    "当任务差异很大时，应拆分应用或模板，而不是让一个系统提示词覆盖所有场景。"
  ],
  "enterpriseCase": {
    "title": "销售助手越权生成折扣承诺",
    "scenario": "B2B 销售助手服务 400 名销售，每天生成约 3200 条客户回复，允许读取 CRM 摘要但不能承诺价格和合同条款。",
    "problem": "上线两周后，法务抽检发现 37 条回复暗示可提供超审批折扣，其中 11 条被销售直接发送给客户。",
    "analysis": "系统提示只写了友好专业，没有写清价格承诺边界、审批升级条件和输出前风险检查；CRM 工具也没有给价格字段做权限隔离。",
    "solution": "重写系统提示，明确禁止承诺折扣和法律条款，遇到价格请求必须生成待审批草稿；同时在工具层屏蔽未授权价格字段并记录 trace。",
    "takeaway": "系统提示词要和权限、工具和审计一起构成边界，不能只靠风格描述。"
  },
  "pitfalls": [
    "把系统提示词写成品牌语气指南，却缺少任务边界。",
    "在系统提示中承诺模型无法验证的事实准确性。",
    "一个提示词覆盖所有业务线，导致规则互相冲突。",
    "只改提示词，不同步权限、工具白名单和评测用例。"
  ],
  "diagnosticQuestion": {
    "id": "q-system-prompt-1",
    "type": "single",
    "scenario": "销售助手偶尔生成超审批折扣承诺。当前系统提示只有“保持专业、帮助销售提升转化”，工具层仍可读取 CRM 中的历史折扣字段。",
    "question": "最优先的修复组合是什么？",
    "options": [
      {
        "id": "a",
        "text": "先降低温度并缩短输出，让承诺性话术更少出现"
      },
      {
        "id": "b",
        "text": "先把所有销售回复改成人工审核，并在事故后补抽检"
      },
      {
        "id": "c",
        "text": "先写清折扣边界、收紧价格字段权限并记录拦截证据"
      },
      {
        "id": "d",
        "text": "先补充更多成交案例和客户分层话术，让模型学习折扣习惯"
      }
    ],
    "correctOptionIds": [
      "c"
    ],
    "explanation": "C 同时修补系统提示缺少价格边界和工具层越权，并留下拦截证据。A 只降低随机性，不能定义业务边界。B 是人工兜底，不是链路修复。D 会引入更多折扣模式，可能加重越界生成。",
    "troubleshootingPath": [
      "确认系统提示是否写明禁止事项和升级条件",
      "检查工具可见字段是否超出应用权限",
      "补充价格请求评测集",
      "上线前用 trace 抽检高风险回复",
      "建立版本化提示词变更记录"
    ],
    "relatedConceptIds": [
      "prompt-context",
      "tool-calling",
      "context-pollution",
      "human-in-the-loop",
      "agents-md"
    ]
  },
  "keyTakeaways": [
    "系统提示词是应用级边界，不是单纯语气配置。",
    "关键约束要同时落在提示、工具权限和评测中。",
    "系统提示词需要版本管理和线上事故复盘。"
  ],
  "relatedConceptIds": [
    "prompt-context",
    "tool-calling",
    "context-pollution",
    "human-in-the-loop",
    "agents-md"
  ]
},
{
  "id": "context-compression",
  "title": "上下文压缩",
  "slug": "context-compression",
  "moduleId": "m4",
  "order": 4,
  "difficulty": "intermediate",
  "estimatedMinutes": 10,
  "tags": [
    "Context Compression",
    "摘要",
    "长上下文",
    "成本优化"
  ],
  "contentStatus": "mvp",
  "hasAnimation": false,
  "definition": "上下文压缩是在不丢失关键决策信息的前提下，把历史对话、检索材料或工具结果裁剪、摘要、结构化，放入有限上下文窗口的工程策略。",
  "whyItMatters": "Agent 和企业助手常常需要跨多轮任务工作。如果原样塞入全部历史，成本和延迟会上升，关键事实还会被噪音淹没；如果压缩过度，又会丢掉约束、证据和用户偏好。",
  "mentalModel": "上下文压缩不是把文本变短，而是把工作现场整理成交接记录。交接记录要保留目标、已做决定、未解决问题、证据来源和风险，而不是把所有聊天压成一句泛泛摘要。",
  "mechanism": [
    "先区分必须保留的信息：当前目标、硬约束、用户偏好、已验证事实、工具结果和未关闭风险。",
    "对冗长历史做结构化摘要，保留来源和时间戳，避免摘要变成无证据的新事实。",
    "对检索材料采用片段裁剪、去重和按任务重排，而不是简单截断前 N 个 Token。",
    "本讲只处理“当轮窗口放不下时怎么取舍”；跨会话长期保存和失效治理属于记忆，状态分层属于分层会话。",
    "压缩策略要用任务成功率、遗漏率、Token 成本和首字延迟共同评估。"
  ],
  "enterpriseCase": {
    "title": "采购 Agent 多轮谈判后遗忘红线",
    "scenario": "采购团队用 Agent 辅助供应商谈判，单个任务平均 26 轮对话，涉及报价、交期、合规条款和审批记录。",
    "problem": "当历史超过 45k Token 后，系统自动截断早期对话，导致 14% 的草案遗漏“付款周期不得短于 60 天”的采购红线。",
    "analysis": "链路只按时间截断，没有把硬约束和已审批结论提升为结构化任务状态；摘要也没有保留证据来源。",
    "solution": "把上下文压缩为目标、硬约束、已确认条款、待确认问题和证据引用五栏，原文保留可回溯链接，并用 120 个历史任务回放评估遗漏率。",
    "takeaway": "压缩的目标是保留决策状态，不是机械减少 Token。"
  },
  "pitfalls": [
    "把压缩等同于通用摘要，丢掉约束和证据。",
    "只按时间截断历史，早期硬规则最容易消失。",
    "压缩后没有原文引用，错误摘要无法追责。",
    "只看 Token 下降，不评估任务成功率和遗漏率。"
  ],
  "diagnosticQuestion": {
    "id": "q-context-compression-1",
    "type": "single",
    "scenario": "采购 Agent 在长任务中经常忘记早期审批红线。日志显示历史超过窗口后按时间截断，摘要只有一段自然语言，没有来源引用。",
    "question": "第一步应该怎样改压缩策略？",
    "options": [
      {
        "id": "a",
        "text": "先切到更大窗口模型，保留时间截断策略"
      },
      {
        "id": "b",
        "text": "先抽取审批红线、已确认结论和证据来源为任务状态"
      },
      {
        "id": "c",
        "text": "先把全部历史写入向量库，再按相似度补回最近片段"
      },
      {
        "id": "d",
        "text": "先限制模型输出长度，把节省的 token 留给更多历史"
      }
    ],
    "correctOptionIds": [
      "b"
    ],
    "explanation": "B 针对遗忘审批红线的根因，把硬约束、确认结论和证据来源提升为任务状态。A 只是推迟窗口耗尽。C 会补回相似片段但不保证权威状态。D 节省输出 token，不解决输入历史丢失。",
    "troubleshootingPath": [
      "识别被遗忘的是硬约束、事实还是偏好",
      "检查当前裁剪和摘要策略",
      "设计结构化任务状态字段",
      "补原文引用和更新时间",
      "用历史任务回放评估遗漏率与成本"
    ],
    "relatedConceptIds": [
      "context-window",
      "prompt-context",
      "context-pollution",
      "memory",
      "agent-loop"
    ]
  },
  "keyTakeaways": [
    "上下文压缩要保留决策状态和证据链。",
    "时间截断是最危险也最常见的简化策略。",
    "压缩效果要用质量、成本和延迟一起验证。"
  ],
  "relatedConceptIds": [
    "context-window",
    "prompt-context",
    "context-pollution",
    "memory",
    "agent-loop"
  ]
},
{
  "id": "context-pollution",
  "title": "上下文污染",
  "slug": "context-pollution",
  "moduleId": "m4",
  "order": 5,
  "difficulty": "intermediate",
  "estimatedMinutes": 10,
  "tags": [
    "Context Pollution",
    "上下文污染",
    "提示注入",
    "质量风险"
  ],
  "contentStatus": "mvp",
  "hasAnimation": false,
  "definition": "上下文污染是指无关、过期、冲突、低可信或恶意的信息进入模型可见上下文，干扰模型对当前任务的判断。",
  "whyItMatters": "Agent 越依赖检索、工具和多轮历史，越容易把外部噪音带进决策。污染不会像接口错误那样明显报错，而是让模型看似正常地给出错误结论，是企业 AI 最隐蔽的质量风险之一。",
  "mentalModel": "上下文污染像把错误便利贴贴到操作台上。模型可能仍然按流程工作，但它参考的是被污染的线索，最后错误看起来像推理失败，根因却在输入材料。",
  "mechanism": [
    "污染来源包括过期文档、低质量检索片段、用户提示注入、历史对话残留和工具返回的未校验数据。",
    "当上下文中出现冲突信息时，模型可能选择位置更靠前、措辞更强或更近期的内容，而不一定选择权威来源。",
    "污染会放大幻觉、越权操作和错误工具调用，尤其在自动执行链路中风险更高。",
    "治理污染需要来源分级、输入过滤、冲突检测、隔离不可信内容和 trace 复盘。",
    "高风险任务应把外部材料作为待验证证据，而不是默认事实。"
  ],
  "enterpriseCase": {
    "title": "内部知识库被旧页面污染",
    "scenario": "IT 服务台助手接入 12 万篇内部文档和工单历史，每日处理约 9000 次员工咨询。",
    "problem": "VPN 配置问题的首解率从 82% 降到 61%，大量回答引用了旧网关地址，导致员工按错步骤操作。",
    "analysis": "检索索引保留了迁移前页面，旧页面点击量高、关键词匹配强，被排在新文档前；上下文没有来源权威级和失效标记。",
    "solution": "清理过期页面，为文档增加生效状态和系统边界标签，检索时降低工单历史权重，并对冲突答案触发澄清或人工确认。",
    "takeaway": "上下文污染通常来自看似合法的数据源，必须靠元数据和过滤策略治理。"
  },
  "pitfalls": [
    "认为只要来源是内部系统就一定可信。",
    "把用户上传内容和系统规则放在同一权威层级。",
    "只关注提示注入，忽视过期文档和历史残留。",
    "没有 trace，无法知道错误答案引用了哪段材料。"
  ],
  "diagnosticQuestion": {
    "id": "q-context-pollution-1",
    "type": "single",
    "scenario": "IT 助手频繁给出旧 VPN 网关地址。检索日志显示旧页面和新页面同时命中，旧页面点击量高所以排序靠前，回答 trace 引用了旧页面。",
    "question": "最优先应该做什么？",
    "options": [
      {
        "id": "a",
        "text": "先让模型比较新旧页面内容和发布日期，再自行选择更可信答案"
      },
      {
        "id": "b",
        "text": "先把旧地址写入系统提示黑名单，并继续保留检索召回"
      },
      {
        "id": "c",
        "text": "先增加历史工单召回，确认旧地址是否是环境差异"
      },
      {
        "id": "d",
        "text": "先降低旧页面权重、补生效状态并按权威级重排结果"
      }
    ],
    "correctOptionIds": [
      "d"
    ],
    "explanation": "D 直接处理污染源、有效期和权威排序。A 把数据治理推给模型。B 仍让旧地址进入上下文。C 会引入更多历史噪音，且 trace 已经指向旧页面排序问题。",
    "troubleshootingPath": [
      "定位错误答案引用的上下文片段",
      "检查片段来源、版本和生效状态",
      "清理或降权过期与低可信材料",
      "补冲突检测和权威来源优先级",
      "回放高频问题验证首解率"
    ],
    "relatedConceptIds": [
      "prompt-context",
      "context-window",
      "context-compression",
      "hallucination",
      "system-prompt"
    ]
  },
  "keyTakeaways": [
    "上下文污染是输入材料问题，不只是模型推理问题。",
    "内部来源也需要版本、权威级和生效状态。",
    "trace 是定位污染片段和复盘错误的关键。"
  ],
  "relatedConceptIds": [
    "prompt-context",
    "context-window",
    "context-compression",
    "hallucination",
    "system-prompt"
  ]
},
{
  "id": "layered-session",
  "title": "分层会话",
  "slug": "layered-session",
  "moduleId": "m4",
  "order": 6,
  "difficulty": "advanced",
  "estimatedMinutes": 10,
  "tags": [
    "Layered Session",
    "会话状态",
    "Agent",
    "上下文工程"
  ],
  "contentStatus": "mvp",
  "hasAnimation": false,
  "definition": "分层会话是把一次 AI 交互中的长期偏好、任务状态、短期对话、工具结果和审计记录拆成不同层级管理，而不是把所有内容混在同一段历史里。",
  "whyItMatters": "企业 Agent 需要既记得任务进度，又不能让过期工具结果、临时偏好或敏感信息长期污染后续请求。分层会话让上下文可裁剪、可审计、可恢复，也能降低成本和安全风险。",
  "mentalModel": "分层会话像项目工作台：长期规则放在制度柜，当前任务放在看板，刚刚查到的工具结果放在临时夹，审计日志单独归档。不同材料有不同生命周期。",
  "mechanism": [
    "长期层保存稳定偏好、角色和组织规则，但必须受权限和版本控制约束。",
    "任务层保存目标、计划、当前状态、已完成步骤、待确认问题和失败重试记录。",
    "短期对话层保留最近几轮自然语言交互，用于维持语义连贯。",
    "工具层保存结构化返回和来源，按新鲜度、可信度和任务相关性决定是否进入上下文。",
    "分层会话关心“状态放在哪一层、生命周期多长”；哪些事实值得跨任务沉淀，是记忆治理的职责。"
  ],
  "enterpriseCase": {
    "title": "报销助手把临时审批意见带到下一位员工",
    "scenario": "财务共享中心上线报销 Agent，覆盖 6000 名员工，单日约 2500 个报销会话，支持读取发票、制度和审批流。",
    "problem": "灰度期间出现 19 起错误建议：上一位经理对特例报销的临时意见被带入下一位员工的普通报销判断。",
    "analysis": "系统把最近对话、审批工具结果和长期偏好放在同一个会话历史中，切换用户后只清空了 UI 消息，没有清空任务层和工具层状态。",
    "solution": "按用户、任务和工具结果拆分会话层级；跨用户强制隔离任务状态，工具结果设置任务级 TTL，并把审计日志只用于复盘不回灌模型。",
    "takeaway": "会话不是一段聊天记录，而是一组生命周期不同的状态层。"
  },
  "pitfalls": [
    "把所有历史消息都当成同等权重的上下文。",
    "用户切换时只清 UI，不清任务状态和工具缓存。",
    "让审计日志长期进入模型窗口，造成隐私和污染风险。",
    "没有任务级状态，Agent 只能依赖自然语言历史猜进度。"
  ],
  "diagnosticQuestion": {
    "id": "q-layered-session-1",
    "type": "single",
    "scenario": "报销 Agent 偶尔把上一位员工的特例审批意见用于下一位员工。排查发现 UI 对话已清空，但工具结果和任务状态仍挂在同一个后端 session 上。",
    "question": "最优先应该调整什么？",
    "options": [
      {
        "id": "a",
        "text": "先在系统提示中要求复述员工姓名，再输出报销判断"
      },
      {
        "id": "b",
        "text": "先扩大审计日志保留时间，方便事后追查串用案例"
      },
      {
        "id": "c",
        "text": "先按用户和任务隔离 session，并设置工具结果 TTL"
      },
      {
        "id": "d",
        "text": "先把所有历史压缩成摘要，并让模型在摘要里区分员工、审批意见和工具结果"
      }
    ],
    "correctOptionIds": [
      "c"
    ],
    "explanation": "C 直接修复后端任务状态和工具结果串用。A 只提示模型，不能隔离状态。B 有助审计但不阻止污染。D 可能把错误状态压缩后继续传播。",
    "troubleshootingPath": [
      "确认污染信息来自对话、任务状态还是工具结果",
      "检查 session key 是否包含用户和任务边界",
      "为工具结果设置 TTL 与作用域",
      "区分模型上下文和审计日志",
      "用跨用户切换用例回归验证"
    ],
    "relatedConceptIds": [
      "prompt-context",
      "context-compression",
      "context-pollution",
      "memory",
      "tool-calling"
    ]
  },
  "keyTakeaways": [
    "分层会话把不同生命周期的信息分开管理。",
    "任务状态、工具结果和审计日志不应混成普通聊天历史。",
    "会话隔离是 Agent 安全和稳定性的基础。"
  ],
  "relatedConceptIds": [
    "prompt-context",
    "context-compression",
    "context-pollution",
    "memory",
    "tool-calling"
  ]
},
{
  "id": "tool-calling",
  "title": "工具调用",
  "slug": "tool-calling",
  "moduleId": "m4",
  "order": 11,
  "difficulty": "intermediate",
  "estimatedMinutes": 10,
  "tags": [
    "Tool Calling",
    "Function Calling",
    "Agent Loop",
    "工具权限"
  ],
  "contentStatus": "mvp",
  "hasAnimation": true,
  "definition": "工具调用是让模型在生成自然语言之外，按约定参数请求外部函数、系统或数据源执行动作，并把返回结果纳入后续推理的机制。",
  "whyItMatters": "Agent 能从聊天变成做事，关键就在于工具调用。但工具调用也是权限、可靠性和审计风险的入口：模型决定调用什么，系统必须决定能不能调用、参数是否合规、结果是否可信、失败如何恢复。",
  "mentalModel": "工具调用不是给模型一把万能钥匙，而是给它一组带权限、参数校验和回执的工单通道。模型可以提出要办什么，平台负责检查、执行和记录。",
  "mechanism": [
    "平台向模型暴露工具名称、用途、参数 schema、权限边界和调用示例。",
    "模型在 Agent Loop 中观察任务状态，决定是否需要工具以及使用哪组参数。",
    "运行时校验参数、权限、速率和敏感操作风险，通过后才真正执行工具。",
    "工具返回结构化结果或错误，模型需要基于结果继续推理、重试、澄清或转人工。",
    "每次工具调用都应进入 trace，便于排查错误动作、成本异常和权限问题。"
  ],
  "animation": {
    "type": "agent-loop",
    "title": "工具调用如何进入 Agent Loop",
    "steps": [
      {
        "id": "s1",
        "title": "目标进入循环",
        "description": "用户给出需要完成的任务，系统同时带入权限、可用工具和业务约束。",
        "highlightTargets": [
          "goal",
          "constraints"
        ]
      },
      {
        "id": "s2",
        "title": "观察上下文",
        "description": "Agent 读取当前对话、任务状态和可用证据，判断是否仅靠模型回答足够。",
        "highlightTargets": [
          "observe",
          "context"
        ]
      },
      {
        "id": "s3",
        "title": "决定调用工具",
        "description": "当任务需要外部事实或动作时，模型生成工具调用意图和参数，进入执行前校验。",
        "highlightTargets": [
          "plan",
          "tools"
        ]
      },
      {
        "id": "s4",
        "title": "执行并返回结果",
        "description": "运行时校验权限和参数后执行工具，工具结果回到循环中成为新的上下文。",
        "highlightTargets": [
          "act",
          "tool-result"
        ]
      },
      {
        "id": "s5",
        "title": "校验结果",
        "description": "Agent 检查工具结果是否满足目标，失败时重试、澄清或升级人工。",
        "highlightTargets": [
          "check",
          "evidence"
        ]
      },
      {
        "id": "s6",
        "title": "继续或停止",
        "description": "如果目标未完成，循环继续；如果完成或触发风险条件，则停止或转人工。",
        "highlightTargets": [
          "continue",
          "stop",
          "human-review"
        ]
      }
    ]
  },
  "enterpriseCase": {
    "title": "工单 Agent 调错权限工具",
    "scenario": "IT 运维 Agent 每天处理约 1400 个账号和权限工单，可调用查询用户、重置密码、开通权限和创建审批单等工具。",
    "problem": "灰度第 3 天出现 7 起错误开通权限，均来自模型把“查询某系统权限”误判为“开通某系统权限”。",
    "analysis": "工具描述过于相似，参数 schema 缺少操作意图字段，高风险工具没有二次确认和审批校验；trace 只记录最终文本，没有记录工具参数。",
    "solution": "重命名工具并拆分只读/写入能力，为写工具增加审批单号、影响范围和人工确认校验；trace 只记录安全字段、参数 schema、工具版本、审批 id、影响范围和脱敏参数摘要。",
    "takeaway": "工具调用的核心不是能调通，而是权限、参数、风险和审计闭环。"
  },
  "pitfalls": [
    "把工具描述写得含糊，导致模型误选工具。",
    "只校验参数类型，不校验业务权限和操作风险。",
    "让写入型工具无需确认直接执行。",
    "工具失败后让模型自由重试，造成重复动作。",
    "不记录工具版本、审批证据、脱敏参数摘要和错误码，事故后无法复盘。"
  ],
  "diagnosticQuestion": {
    "id": "q-tool-calling-1",
    "type": "single",
    "scenario": "运维 Agent 把查询权限误执行为开通权限。两个工具描述相似，高风险写工具无需审批单号，trace 里没有保存可审计参数摘要和审批证据。",
    "question": "最优先的修复是什么？",
    "options": [
      {
        "id": "a",
        "text": "先拆清只读/写入边界，再补审批、权限和脱敏 trace"
      },
      {
        "id": "b",
        "text": "先换更强模型，观察误调用率是否下降"
      },
      {
        "id": "c",
        "text": "先在系统提示中声明不要调错工具，并要求逐步解释调用理由"
      },
      {
        "id": "d",
        "text": "先给失败调用自动重试三次，避免查询失败被误判为开通"
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "A 是第一步，先把只读和写入边界拆清，再为写工具补审批、权限和脱敏 trace。trace 应保留安全字段、参数 schema、审批 id、影响范围、工具版本和脱敏摘要，而不是默认保存原始敏感参数。B 不能替代运行时边界。C 只是提示约束，挡不住写入型误调用。D 会放大错误动作。",
    "troubleshootingPath": [
      "复盘错误调用的工具名、脱敏参数摘要、审批 id 和上下文引用",
      "检查工具描述与 schema 是否区分只读和写入",
      "为高风险工具增加权限、审批和人工确认",
      "记录安全参数摘要、工具版本、结果摘要和错误码",
      "用历史工单回放评估误调用率"
    ],
    "relatedConceptIds": [
      "agent-loop",
      "system-prompt",
      "layered-session",
      "human-in-the-loop",
      "subagent",
      "agents-md"
    ]
  },
  "keyTakeaways": [
    "工具调用让 Agent 能执行外部动作，也引入权限和审计风险。",
    "写入型工具必须有参数校验、权限控制和升级条件。",
    "工具结果要回到 Agent Loop 中被校验，而不是默认成功。",
    "trace 应记录工具选择、参数、返回和失败路径。"
  ],
  "relatedConceptIds": [
    "agent-loop",
    "system-prompt",
    "layered-session",
    "human-in-the-loop",
    "subagent",
    "agents-md"
  ]
},
{
  "id": "agents-md",
  "title": "AGENTS.md",
  "slug": "agents-md",
  "moduleId": "m4",
  "order": 7,
  "difficulty": "intermediate",
  "estimatedMinutes": 10,
  "tags": [
    "AGENTS.md",
    "协作约束",
    "仓库说明",
    "Agent"
  ],
  "contentStatus": "mvp",
  "hasAnimation": false,
  "definition": "AGENTS.md 是写给 Agent 运行环境的项目级操作手册，用来固定业务边界、角色权限、可调用工具、验证命令和升级条件；在代码仓库中它表现为仓库说明，在业务 Agent 平台中也可以是同类运行规程。",
  "whyItMatters": "Agent 不会自动知道组织里的隐性协作规则。没有类似 AGENTS.md 的操作手册，后续执行者可能读错权威文档、调用错工具、绕过审批流程，或者把草稿内容直接写入生产系统。",
  "mentalModel": "把 AGENTS.md 看成进入工地前必须看的施工牌：它不替代图纸，但告诉每个角色能进哪片区域、先读哪份图纸、完工前必须验收什么。",
  "mechanism": [
    "AGENTS.md 应先声明当前项目状态，让接手者知道哪些模块已封板、哪些范围仍是 stub。",
    "它要列出文件所有权和角色边界，避免内容 Agent、审核 Agent、动画 Agent 直接改核心代码。",
    "它要指向权威规格和命令门禁，让实现可追溯到 docs 和可执行验证。",
    "它要记录首版不做什么，防止后续 Agent 擅自引入后端、登录、真实模型 API 或架构扩张。",
    "每次封板后必须刷新 AGENTS.md，否则后续 Agent 会基于过期状态继续开发。"
  ],
  "enterpriseCase": {
    "title": "金融运营 Agent 缺少操作手册导致越权改配置",
    "scenario": "一家金融集团为 22 个运营团队上线内部 Agent 平台，覆盖 140 个自动化流程和 900 多名一线员工，Agent 可读取工单、生成配置变更建议并创建审批单。",
    "problem": "试点两周内出现 13 起越权建议，其中 5 起把“生成审批草稿”误做成“直接提交变更”，平均回滚耗时 46 分钟。",
    "analysis": "平台只有工具列表，没有统一说明哪些团队可改哪些系统、哪些动作必须转审批、哪些文档是权威来源；不同团队把口头规则写在各自聊天模板里。",
    "solution": "为每个业务域建立 AGENTS.md 式操作手册，声明角色边界、工具权限、审批阈值、验证命令和人工升级条件，并把手册版本写入每次 trace。",
    "takeaway": "AGENTS.md 的核心价值不是仓库自述，而是把 Agent 的隐性操作规则变成可审计、可继承的运行契约。"
  },
  "pitfalls": [
    "把 AGENTS.md 写成泛泛介绍，没有明确可写范围和禁止事项。",
    "封板后不更新当前状态，导致后续 Agent 重做已完成模块。",
    "只写命令，不写文件所有权和内容流水线。",
    "让 AGENTS.md 与 docs/project-board.md 互相矛盾。"
  ],
  "diagnosticQuestion": {
    "id": "q-agents-md-1",
    "type": "single",
    "scenario": "金融运营 Agent 频繁把“生成审批草稿”误做成“提交变更”。排查发现平台只有工具清单，没有说明团队权限、审批阈值和哪些文档是权威规则。",
    "question": "最优先应该补什么？",
    "options": [
      {
        "id": "a",
        "text": "先把各团队口头规则继续追加到提示词末尾"
      },
      {
        "id": "b",
        "text": "先补 Agent 操作手册，写清权限、权威来源和升级条件"
      },
      {
        "id": "c",
        "text": "先关闭提交类工具，只保留读取能力直到事故归零"
      },
      {
        "id": "d",
        "text": "先把审批阈值写入输出格式，让模型自行判断每次是否需要审批和提交"
      }
    ],
    "correctOptionIds": [
      "b"
    ],
    "explanation": "B 是第一步，用操作手册统一权限、权威来源和升级条件。A 会继续分散规则。C 可以止血但会让业务流程瘫痪。D 把审批判断交给模型，缺少运行时契约和审计。",
    "troubleshootingPath": [
      "复盘越权动作对应的规则缺口",
      "梳理角色、工具和审批边界",
      "形成项目级 Agent 操作手册",
      "把手册版本写入 trace",
      "用高风险流程回放验证规则是否生效"
    ],
    "relatedConceptIds": [
      "prompt-context",
      "repo-context",
      "spec-driven-development",
      "subagent",
      "human-in-the-loop"
    ]
  },
  "keyTakeaways": [
    "AGENTS.md 是多 Agent 协作的开工入口和边界说明。",
    "它必须包含当前状态、文件所有权、硬边界和验证门禁。",
    "每次封板后不刷新 AGENTS.md，就会制造下一轮上下文污染。"
  ],
  "relatedConceptIds": [
    "prompt-context",
    "repo-context",
    "spec-driven-development",
    "subagent",
    "human-in-the-loop"
  ]
},
{
  "id": "repo-context",
  "title": "仓库上下文",
  "slug": "repo-context",
  "moduleId": "m4",
  "order": 8,
  "difficulty": "advanced",
  "estimatedMinutes": 11,
  "tags": [
    "Repo Context",
    "代码理解",
    "上下文工程",
    "开发 Agent"
  ],
  "contentStatus": "mvp",
  "hasAnimation": false,
  "definition": "仓库上下文是当 Agent 的工作对象是代码或配置仓库时，需要读取和整理的项目事实集合，包括架构文档、类型定义、入口文件、测试、验证命令、Git 状态和近期变更。它是“Agent 观察环境”的一种工程形态。",
  "whyItMatters": "代码和配置类 Agent 的很多错误不是写代码能力不足，而是读错项目事实。仓库越大，越需要有选择地收集上下文：读太少会误判架构，读太多会淹没关键约束。",
  "mentalModel": "仓库上下文像手术前的病历摘要：医生不需要背完整医院档案，但必须知道病史、禁忌、影像、当前用药和这次手术的目标部位。",
  "mechanism": [
    "先读 AGENTS.md、README、project-board 和相关规格，确认当前阶段和不可破坏约定。",
    "再定位任务相关的类型、数据源、组件、工具函数和测试，而不是全仓库漫游。",
    "用 Git 状态区分自己的改动、用户已有改动和未跟踪文件，避免误删或覆盖。",
    "把上下文压缩成可执行判断：该改哪些文件、不能改哪些文件、验收跑哪些命令。",
    "遇到规格冲突时，以权威文档和现有测试为准，并把冲突显式登记。"
  ],
  "enterpriseCase": {
    "title": "零售集团配置 Agent 只读报错文件导致价格规则回退",
    "scenario": "一家零售集团有 180 个微服务和 37 个区域价格配置仓库，配置 Agent 每周处理约 260 个促销规则变更。",
    "problem": "一次华东区促销修复中，Agent 只读取报错 YAML，把全局折扣上限从 8% 回退到旧版 5%，影响 4300 个 SKU 的次日价格预览。",
    "analysis": "Agent 没读取区域覆盖规则、价格引擎 README、最近 3 个变更提交和回归测试，误把局部报错当成全局规则问题。",
    "solution": "为配置任务建立仓库上下文包：权威 README、区域覆盖链、变更历史、测试命令和 Git dirty 状态；改动前输出影响范围摘要。",
    "takeaway": "仓库上下文让 Agent 先理解代码和配置的真实边界，再选择最小安全改动。"
  },
  "pitfalls": [
    "只读报错文件，不读调用链和权威规格。",
    "把搜索结果数量当成理解程度，缺少结构化判断。",
    "忽略 Git dirty 状态，覆盖用户已有改动。",
    "不记录上下文来源，后续复盘不知道决策依据。",
    "把过期报告当成当前状态。"
  ],
  "diagnosticQuestion": {
    "id": "q-repo-context-1",
    "type": "single",
    "scenario": "配置 Agent 修复促销规则时只读了报错 YAML，没读区域覆盖链和最近变更，结果把华东区规则误改成全局折扣上限。",
    "question": "下一次最应该如何避免同类问题？",
    "options": [
      {
        "id": "a",
        "text": "先把全仓 YAML、README、历史报告和最近提交都塞进模型窗口"
      },
      {
        "id": "b",
        "text": "先只依赖报错行和配置校验输出，定位需要修改的位置"
      },
      {
        "id": "c",
        "text": "先让业务方口头确认每个价格字段含义，再允许修改"
      },
      {
        "id": "d",
        "text": "先建立任务上下文包，覆盖权威规则、覆盖链、变更史和验收命令"
      }
    ],
    "correctOptionIds": [
      "d"
    ],
    "explanation": "D 是第一步，把权威规则、覆盖链、变更历史和验收命令组成最小关键事实。A 会带来噪音和窗口压力。B 只能定位语法或局部报错，不能判断业务口径。C 可用于模糊字段，但不应替代仓库事实收集。",
    "troubleshootingPath": [
      "确认任务影响的用户行为",
      "读取 AGENTS.md 和权威规格",
      "追踪数据源与派生工具",
      "检查 Git 状态和近期报告",
      "把验收命令绑定到改动范围"
    ],
    "relatedConceptIds": [
      "agents-md",
      "context-compression",
      "spec-driven-development",
      "issue-fix-agent",
      "subagent"
    ]
  },
  "keyTakeaways": [
    "仓库上下文要服务实现判断，不是机械读取更多文件。",
    "权威规格、数据源、调用链、测试和 Git 状态是开发前核心事实。",
    "上下文包越清晰，Agent 越不容易越界重构或覆盖用户改动。"
  ],
  "relatedConceptIds": [
    "agents-md",
    "context-compression",
    "spec-driven-development",
    "issue-fix-agent",
    "subagent"
  ]
},
{
  "id": "spec-driven-development",
  "title": "规格驱动开发",
  "slug": "spec-driven-development",
  "moduleId": "m4",
  "order": 9,
  "difficulty": "advanced",
  "estimatedMinutes": 11,
  "tags": [
    "Spec-driven Development",
    "规格",
    "验收标准",
    "工程流程"
  ],
  "contentStatus": "mvp",
  "hasAnimation": false,
  "definition": "规格驱动开发是先冻结产品、架构、数据、视觉和验收规则，再让 Agent 实现、测试和复盘都围绕这些规格闭环，而不是边写边猜需求。",
  "whyItMatters": "AI 辅助开发速度很快，也更容易把示例、占位文案和临时想法误当权威。规格驱动把“哪个文档说了算、改完怎么验收、哪些边界不能碰”显式化，减少 Agent 自作主张。",
  "mentalModel": "规格不是写给归档系统看的文档，而是开发时的导航仪。它告诉 Agent 目标、道路限制、禁止驶入区域和到达后如何判定成功。",
  "mechanism": [
    "先识别权威规格：产品规格、架构文档、内容 schema、视觉规范和验收清单分别约束不同层面。",
    "实现前把需求拆成可验证的行为和数据变化，避免只按页面感觉改。",
    "当原型、示例和 schema 冲突时，必须按预先声明的权威顺序决策。",
    "代码改动要能追溯到具体规格条目，封板报告要记录验证命令和剩余风险。",
    "规格变更本身也要走同步更新：类型、校验脚本、文档和测试必须一起改。"
  ],
  "enterpriseCase": {
    "title": "保险理赔助手把原型示例误当合规规则",
    "scenario": "一家保险公司建设理赔 Agent，涉及 4 条产品线、12 类理赔材料和 3 个合规审查节点，月均约 7.5 万次理赔咨询。",
    "problem": "灰度中有 6.8% 的高额理赔被错误引导到普通材料清单，因为 Agent 实现时复制了原型里的示例金额阈值 5 万元，而合规规格规定应为 2 万元。",
    "analysis": "团队没有区分视觉原型、产品规格和合规规则的权威范围，验收也只检查页面流程，没有用高额理赔回放集验证。",
    "solution": "建立规格优先级：合规规则高于产品示例，产品规格高于原型占位；金额阈值从规则表派生，并补 200 条历史理赔回放测试。",
    "takeaway": "规格驱动开发的关键是让 Agent 知道每类决策的权威来源，并把验收绑定到这些来源。"
  },
  "pitfalls": [
    "把高保真原型里的占位数字当成真实数据。",
    "只按用户一句话改代码，不回查已有规格边界。",
    "规格改了但类型和校验脚本没同步。",
    "验收只看页面能跑，不检查权威数据和命令门禁。"
  ],
  "diagnosticQuestion": {
    "id": "q-spec-driven-development-1",
    "type": "single",
    "scenario": "理赔 Agent 把原型示例里的 5 万元阈值写进实现，但合规规格规定高额理赔阈值是 2 万元。页面流程可用，历史回放却暴露误导。",
    "question": "最优先应该建立什么规则？",
    "options": [
      {
        "id": "a",
        "text": "先定义规格权威顺序，并明确合规规则高于原型示例"
      },
      {
        "id": "b",
        "text": "先禁止设计稿出现任何金额、比例或流程示例，避免被复制"
      },
      {
        "id": "c",
        "text": "先把合规阈值写进 UI 文案，方便人工浏览时发现错误"
      },
      {
        "id": "d",
        "text": "先增加人工点击验收，只要页面流程可走通就放行"
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "A 是第一步，先明确合规规则、产品规格和原型示例的权威顺序。B 不现实，原型需要示例。C 可能暴露信息且不能约束数据来源。D 只能检查流程，不能验证合规阈值。",
    "troubleshootingPath": [
      "列出冲突规格和涉及字段",
      "判断每份规格的权威范围",
      "把 UI 文案改为数据派生",
      "补文档提示防止复发",
      "运行结构和构建门禁"
    ],
    "relatedConceptIds": [
      "agents-md",
      "repo-context",
      "context-pollution",
      "prompt-context",
      "system-prompt"
    ]
  },
  "keyTakeaways": [
    "规格驱动不是多写文档，而是让实现和验收有明确权威来源。",
    "不同规格负责不同问题，冲突时要按权威边界决策。",
    "规格变更必须同步类型、校验、文档和报告。"
  ],
  "relatedConceptIds": [
    "agents-md",
    "repo-context",
    "context-pollution",
    "prompt-context",
    "system-prompt"
  ]
},
{
  "id": "subagent",
  "title": "Subagent",
  "slug": "subagent",
  "moduleId": "m4",
  "order": 13,
  "difficulty": "advanced",
  "estimatedMinutes": 10,
  "tags": [
    "Subagent",
    "任务委派",
    "多 Agent",
    "协作边界"
  ],
  "contentStatus": "mvp",
  "hasAnimation": false,
  "definition": "Subagent 是由主 Agent 派生或调用的专门执行者，负责在明确目标、上下文、权限和输出格式下完成一个子任务，再把结果交回主 Agent。",
  "whyItMatters": "复杂任务常常需要并行调查、内容审核、安全检查或浏览器验证。Subagent 能提高吞吐，但如果边界不清，它也会制造重复修改、权限越界和结论冲突。",
  "mentalModel": "Subagent 像被派去做专项检查的同事。你不能只说“去看看”，而要说明看什么、不能碰什么、结果按什么格式回来、谁有最终合入权。",
  "mechanism": [
    "主 Agent 先把总目标拆成独立子任务，确认子任务之间不会争用同一高风险文件。",
    "每个 Subagent 只获得必要上下文、可写范围、验收标准和期望输出格式。",
    "Subagent 的产物应回到主 Agent 汇总，由主 Agent 做冲突消解和最终合入。",
    "对内容、审核、动画和 E2E 等角色，应明确哪些只能产草稿或报告，不能直接改核心数据。",
    "当 Subagent 发现范围外问题，应报告而不是擅自扩大任务。"
  ],
  "enterpriseCase": {
    "title": "风控平台 Subagent 并行分析导致结论冲突",
    "scenario": "一家支付公司用主 Agent 协调三个 Subagent 处理商户风控申诉：交易分析、合规检查和客服摘要，日均约 1800 个申诉工单。",
    "problem": "灰度首周 14% 的申诉报告出现互相矛盾结论：交易分析建议恢复商户，合规检查却要求冻结，主 Agent 直接拼接两份结论发给审核员。",
    "analysis": "Subagent 只收到宽泛目标，没有统一证据口径、输出格式和冲突升级规则；主 Agent 也没有最终裁决和合并检查。",
    "solution": "为每个 Subagent 限定输入证据、输出字段和置信度；主 Agent 负责冲突检测，遇到恢复/冻结不一致必须转人工审核。",
    "takeaway": "Subagent 的价值在分工，风险在集成；没有主控合并规则，并行只会放大冲突。"
  },
  "pitfalls": [
    "把模糊目标直接丢给 Subagent，导致产物不可合并。",
    "多个 Subagent 同时写同一核心文件。",
    "Subagent 只给结论不给证据，主 Agent 无法复核。",
    "发现新问题后擅自扩大范围。",
    "把 Subagent 的报告直接当成已验证事实。"
  ],
  "diagnosticQuestion": {
    "id": "q-subagent-1",
    "type": "single",
    "scenario": "支付风控主 Agent 调用交易分析和合规检查两个 Subagent。一个建议恢复商户，一个建议继续冻结，主 Agent 直接拼接结论发给审核员。",
    "question": "最优先应该调整什么？",
    "options": [
      {
        "id": "a",
        "text": "先取消并行，让主 Agent 独立完成全部分析"
      },
      {
        "id": "b",
        "text": "先让两个 Subagent 互相读取草稿，自行协商统一结论"
      },
      {
        "id": "c",
        "text": "先让主 Agent 负责冲突检测、证据合并和升级路径"
      },
      {
        "id": "d",
        "text": "先拆更多 Subagent，把交易、设备、合规和客服拆更细"
      }
    ],
    "correctOptionIds": [
      "c"
    ],
    "explanation": "C 是第一步，主 Agent 必须承担冲突检测、证据合并和升级职责。A 放弃了分工价值。B 会让子任务互相污染且缺少最终责任。D 会增加更多冲突来源。",
    "troubleshootingPath": [
      "确认冲突文件和越权角色",
      "拆分子任务的输入和输出",
      "限定每个 Subagent 的可写范围",
      "要求证据和结论分开提交",
      "由主 Agent 统一合入并验证"
    ],
    "relatedConceptIds": [
      "agents-md",
      "repo-context",
      "human-in-the-loop",
      "tool-calling",
      "agent-loop"
    ]
  },
  "keyTakeaways": [
    "Subagent 适合专门子任务，不适合无边界自由行动。",
    "委派必须包含目标、上下文、权限、输出格式和验收标准。",
    "主 Agent 应保留最终合入、冲突消解和验证责任。"
  ],
  "relatedConceptIds": [
    "agents-md",
    "repo-context",
    "human-in-the-loop",
    "tool-calling",
    "agent-loop"
  ]
},
{
  "id": "memory",
  "title": "记忆",
  "slug": "memory",
  "moduleId": "m4",
  "order": 14,
  "difficulty": "intermediate",
  "estimatedMinutes": 10,
  "tags": [
    "Memory",
    "长期记忆",
    "偏好",
    "状态管理"
  ],
  "contentStatus": "mvp",
  "hasAnimation": false,
  "definition": "记忆是 AI 应用在单次上下文窗口之外持久保存并在未来可控复用的信息，包括用户偏好、项目决策、任务状态、历史证据和组织规则。",
  "whyItMatters": "没有记忆，Agent 每次都像第一次工作；记忆失控，又会把过期偏好、敏感信息或错误结论带入新任务。企业应用需要的不是无限保存，而是可授权、可过期、可追溯的记忆。",
  "mentalModel": "记忆不是聊天记录仓库，而是经过筛选的工作档案。能留下来的信息要说明来源、适用范围、更新时间和失效条件。",
  "mechanism": [
    "先区分短期上下文、任务状态、长期偏好和组织规则，避免全部混进同一存储。",
    "每条记忆应有来源、作用域、更新时间、置信度和删除或过期策略。",
    "记忆写入需要触发条件，不能把每轮对话自动永久保存。",
    "记忆只负责跨会话复用；当轮窗口的裁剪属于上下文压缩，会话内状态放置属于分层会话。",
    "记忆效果要用任务连续性、错误复用率、隐私事件和用户纠错成本评估。"
  ],
  "enterpriseCase": {
    "title": "项目助手沿用过期架构决策",
    "scenario": "研发团队使用项目 Agent 跟踪 18 个服务的重构计划，Agent 会保存架构决策、命名偏好和部署约束。",
    "problem": "数据库迁移方案变更两周后，Agent 仍在 9 个 PR 建议中沿用旧的双写策略，导致评审反复纠错。",
    "analysis": "记忆只保存结论，没有版本、生效范围和失效条件；新 ADR 合入后没有触发旧记忆失效。",
    "solution": "把记忆拆成项目级决策、用户偏好和任务状态三类，为架构决策绑定 ADR 链接、版本和过期规则，并在读取时优先最新 ADR。",
    "takeaway": "记忆必须可更新、可废弃、可追溯，否则会变成长期上下文污染。"
  },
  "pitfalls": [
    "把所有对话都永久保存成记忆。",
    "只保存结论，不保存来源和适用范围。",
    "记忆没有过期机制，旧决策持续影响新任务。",
    "不同用户或项目共享记忆，造成隐私和串用风险。",
    "让模型自己决定敏感信息是否该记住。"
  ],
  "diagnosticQuestion": {
    "id": "q-memory-1",
    "type": "single",
    "scenario": "项目 Agent 一直建议旧的数据库双写方案。检查发现它的长期记忆里保存了两个月前的架构结论，但没有 ADR 链接、版本、作用域或失效规则。",
    "question": "最优先应该怎么治理记忆？",
    "options": [
      {
        "id": "a",
        "text": "先关闭长期记忆，只保留当前对话和人工粘贴材料"
      },
      {
        "id": "b",
        "text": "先给记忆绑定 ADR 来源、版本、作用域和失效规则"
      },
      {
        "id": "c",
        "text": "先把旧方案和新方案都写进系统提示，让模型自行判断是否过期"
      },
      {
        "id": "d",
        "text": "先提高生成随机性，降低模型重复旧结论的概率"
      }
    ],
    "correctOptionIds": [
      "b"
    ],
    "explanation": "B 建立来源、版本、作用域和失效治理。A 可短期止血但丢失连续性。C 会继续把旧方案带进上下文。D 与记忆污染无关，还会增加不稳定性。",
    "troubleshootingPath": [
      "定位错误建议来自上下文还是长期记忆",
      "检查记忆来源、作用域和更新时间",
      "绑定权威文档或 ADR",
      "设计失效和覆盖策略",
      "回放历史任务评估错误复用率"
    ],
    "relatedConceptIds": [
      "layered-session",
      "context-compression",
      "context-pollution",
      "repo-context",
      "agents-md"
    ]
  },
  "keyTakeaways": [
    "记忆要保存可复用的状态和偏好，不是保存全部聊天。",
    "每条记忆都需要来源、作用域、更新时间和失效规则。",
    "失控记忆会变成长期上下文污染。"
  ],
  "relatedConceptIds": [
    "layered-session",
    "context-compression",
    "context-pollution",
    "repo-context",
    "agents-md"
  ]
},
{
  "id": "human-in-the-loop",
  "title": "Human-in-the-loop",
  "slug": "human-in-the-loop",
  "moduleId": "m4",
  "order": 15,
  "difficulty": "intermediate",
  "estimatedMinutes": 10,
  "tags": [
    "Human-in-the-loop",
    "人工审核",
    "升级条件",
    "风险控制"
  ],
  "contentStatus": "mvp",
  "hasAnimation": false,
  "definition": "Human-in-the-loop 是在 AI 工作流中为高风险、不确定或不可自动判断的步骤设置人工确认、审核、纠错或接管机制。",
  "whyItMatters": "企业 Agent 不能只追求自动化率。越接近写入系统、对外承诺、合规判断和资金操作，越需要明确什么时候必须停下来让人决策，否则小概率错误会变成真实事故。",
  "mentalModel": "Human-in-the-loop 不是给 AI 加一个人工客服尾巴，而是在流程里设置刹车、检查点和升级通道。它应该预先定义触发条件，而不是出事后临时找人。",
  "mechanism": [
    "先识别哪些动作属于高风险：写入、删除、对外发送、权限变更、法律或财务承诺。",
    "为高风险动作定义触发条件，如置信度低、金额超阈值、权限不足、证据冲突或用户投诉。",
    "人工节点应看到模型依据、工具结果、可选动作和风险提示，而不是只看最终答案。",
    "人工反馈要回写为 trace、评测样本或规则更新，形成质量闭环。",
    "指标不只看自动化率，还要看升级命中率、误升级率、事故率和处理时延。"
  ],
  "enterpriseCase": {
    "title": "采购 Agent 自动发送高风险报价",
    "scenario": "采购平台让 Agent 草拟并发送供应商询价邮件，覆盖 120 名采购经理，月均 1.8 万封邮件。",
    "problem": "一次灰度中，Agent 在未确认币种的情况下发出 23 封报价邮件，其中 4 封涉及超过 50 万美元的采购单。",
    "analysis": "流程只设置了最终发送权限，没有把金额阈值、币种不确定、合同条款缺失作为人工确认触发条件。",
    "solution": "为金额、币种、供应商等级和条款缺失设置人工审核规则；审核界面展示证据、工具结果和建议邮件差异。",
    "takeaway": "人工在环不是降低效率，而是把自动化限制在可承受风险内。"
  },
  "pitfalls": [
    "只在事故后人工介入，没有预设升级条件。",
    "人工审核只看模型答案，看不到证据和工具结果。",
    "把所有任务都转人工，自动化价值消失。",
    "只考核自动化率，忽略事故率和误升级率。",
    "人工反馈没有回流到评测和规则。"
  ],
  "diagnosticQuestion": {
    "id": "q-human-in-the-loop-1",
    "type": "single",
    "scenario": "采购 Agent 在币种不确定时自动发送了 23 封询价邮件，其中 4 封金额超过 50 万美元。当前流程只在发送失败后通知人工，没有发送前审核条件。",
    "question": "最优先应该补什么？",
    "options": [
      {
        "id": "a",
        "text": "先关闭自动发送，把所有采购邮件退回人工队列"
      },
      {
        "id": "b",
        "text": "先把系统提示改成务必谨慎，并要求模型复述币种和金额来源"
      },
      {
        "id": "c",
        "text": "先提高置信度阈值，允许达到阈值时继续自动发送"
      },
      {
        "id": "d",
        "text": "先设置发送前审核条件，覆盖高金额、币种不明和条款缺失"
      }
    ],
    "correctOptionIds": [
      "d"
    ],
    "explanation": "D 是第一步，把高金额、币种不确定和条款缺失变成流程级人工确认。A 会牺牲全部自动化。B 只是提示约束，不能拦截风险动作。C 缺少证据展示和人工判断，仍可能自动放行高风险邮件。",
    "troubleshootingPath": [
      "列出自动动作和风险等级",
      "定义金额、权限、证据冲突等升级条件",
      "设计人工审核界面所需证据",
      "记录人工决策和模型依据",
      "把反馈回流到评测和规则"
    ],
    "relatedConceptIds": [
      "tool-calling",
      "subagent",
      "agent-loop",
      "layered-session",
      "context-pollution"
    ]
  },
  "keyTakeaways": [
    "人工在环是高风险 Agent 的安全刹车和质量回路。",
    "升级条件要预先定义，不能只靠模型自觉谨慎。",
    "人工节点需要看到证据、工具结果和风险，而不是只看最终文本。",
    "人工反馈应进入 trace、评测和规则更新。"
  ],
  "relatedConceptIds": [
    "tool-calling",
    "subagent",
    "agent-loop",
    "layered-session",
    "context-pollution"
  ]
},
  {
    "id": "multi-agent",
    "title": "多 Agent 协作",
    "slug": "multi-agent",
    "moduleId": "m4",
    "order": 16,
    "difficulty": "advanced",
    "estimatedMinutes": 12,
    "tags": [
      "多 Agent",
      "Orchestrator",
      "上下文隔离",
      "协调成本",
      "Agent 协作"
    ],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "多 Agent 协作是把一个复杂任务拆给多个各自持有独立上下文的 Agent 分工完成，再由主 Agent 汇总各自结论形成最终输出。它用上下文隔离换取协调成本，并不总是比单 Agent 更优。",
    "whyItMatters": "多 Agent 看似比单 Agent 更强，但每增加一个 Agent，都会叠加上下文传递、结论冲突和 Token 成本。企业落地的关键不是堆 Agent 数量，而是判断任务是否真的需要并行分工，以及主 Agent 如何在不被子任务过程污染的前提下汇总可信结论。",
    "mentalModel": "把多 Agent 协作理解为一个项目组：主 Agent 是项目经理，只看每个成员交回的结论，不亲自旁观全过程；子 Agent 是专员，各自在独立工作区里干活。组织能并行处理更多事，但沟通、对齐和返工的成本也会随人数上升。",
    "mechanism": [
      "主 Agent 先判断任务是否需要拆分：只有当子任务相对独立、可并行、且单一上下文难以容纳时，多 Agent 才有收益。",
      "主 Agent 把任务分解为边界清晰的子任务，分配给各子 Agent，并为每个子 Agent 设定独立的上下文和目标。",
      "每个子 Agent 在自己的上下文窗口内完成工作，主 Agent 通常只接收其结论，而不吸收完整中间过程，避免上下文污染。",
      "常见编排形态包括主从式（orchestrator–worker）、并行扇出后汇聚、以及串行流水线，按任务依赖关系选择。",
      "主 Agent 汇总各子 Agent 结论，处理冲突与重叠，必要时回退重做或升级人工。",
      "Token 成本、失败叠加和可观测性下降是多 Agent 的固有代价，需要用 trace 和评测来约束。"
    ],
    "enterpriseCase": {
      "title": "多 Agent 改写流水线成本失控",
      "scenario": "某研发平台把代码生成流水线拆成需求理解、编码、测试、评审四个子 Agent，覆盖约 200 名工程师，日均处理 6000 个任务。",
      "problem": "上线两周后单任务平均 Token 成本上涨约 3.2 倍，且约 12% 的任务因子 Agent 结论互相冲突而需要返工。",
      "analysis": "四个子 Agent 各自重复读取完整仓库上下文，主 Agent 又把每个子 Agent 的中间过程全部纳入，导致上下文重复膨胀；而该任务本身依赖性强，并不适合并行拆分。",
      "solution": "将强依赖的编码与测试合并回单 Agent，仅对真正独立的需求理解与评审保留子 Agent；主 Agent 只接收结论摘要并加冲突仲裁规则；用 trace 监控每个子 Agent 的 Token 与失败率。",
      "takeaway": "多 Agent 不是默认更优，先确认任务可独立并行，再为协调成本买单。"
    },
    "pitfalls": [
      "默认认为多个 Agent 一定比单 Agent 强，把本可单 Agent 完成的任务强行拆分，反而放大协调成本和延迟。",
      "让主 Agent 吸收所有子 Agent 的完整中间过程，造成上下文污染和 Token 浪费。",
      "子任务之间存在强依赖却强行并行，导致结论互相冲突、频繁返工。",
      "只统计自动化率和任务数，不监控多 Agent 带来的 Token 成本与失败叠加。"
    ],
    "diagnosticQuestion": {
      "id": "q-multi-agent-1",
      "type": "single",
      "scenario": "某团队把一个原本单 Agent 能完成的报表生成任务拆成五个子 Agent 协作，结果延迟从 8 秒升到 25 秒，Token 成本翻倍，且偶发子 Agent 结论冲突。",
      "question": "最优先应该做什么？",
      "options": [
        {
          "id": "a",
          "text": "再增加一个仲裁 Agent 专门解决子 Agent 之间的结论冲突"
        },
        {
          "id": "b",
          "text": "重新评估任务是否真的需要多 Agent，把强依赖的子任务收敛回单 Agent"
        },
        {
          "id": "c",
          "text": "提高每个子 Agent 的上下文窗口上限，让它们看到更多信息"
        },
        {
          "id": "d",
          "text": "为每个子 Agent 单独扩容算力以降低延迟"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "B 是第一步：现象表明任务本不需要多 Agent 拆分，协调成本和上下文重复才是延迟与成本上升的根因。A 在错误的拆分上再加 Agent，只会进一步放大成本。C 扩大窗口会加重 Token 消耗与上下文污染。D 扩容不解决协调与冲突的结构性问题。",
      "troubleshootingPath": [
        "确认任务是否具备可独立并行的子任务",
        "比较单 Agent 与多 Agent 的延迟、Token 和失败率",
        "收敛强依赖子任务，仅保留真正独立的分工",
        "为保留的子 Agent 配置结论摘要与冲突仲裁",
        "用 trace 监控各子 Agent 的成本与失败"
      ],
      "relatedConceptIds": [
        "subagent",
        "human-in-the-loop",
        "agent-loop",
        "context-pollution",
        "token-roi"
      ]
    },
    "keyTakeaways": [
      "多 Agent 用上下文隔离换协调成本，并非默认更优。",
      "拆分的前提是子任务相对独立、可并行、单上下文难以容纳。",
      "主 Agent 应只接收结论，避免被子任务过程污染。",
      "Token 成本、失败叠加和可观测性下降是多 Agent 的固有代价。"
    ],
    "relatedConceptIds": [
      "subagent",
      "human-in-the-loop",
      "agent-loop",
      "context-pollution",
      "layered-session"
    ]
  },
  {
    "id": "code-review-agent",
    "title": "Code Review Agent",
    "slug": "code-review-agent",
    "moduleId": "m5",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 11,
    "tags": [
      "Code Review Agent",
      "代码评审",
      "误报率",
      "质量门禁",
      "AI 原生软件工程"
    ],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "Code Review Agent 是在代码评审环节自动检查变更、给出问题与建议，并把评审标准沉淀为可复用规则的工程 Agent。它辅助而非替代资深评审，价值在一致性与覆盖面。",
    "whyItMatters": "企业代码评审受限于评审人时间与状态，标准不一、覆盖不全。Code Review Agent 能稳定覆盖风格、空值、边界和安全基线，但若被当成强制门禁，会因误报阻断合并、或因漏检制造虚假安全感。",
    "mentalModel": "把 Code Review Agent 看成一名不知疲倦的初审助理：它先过一遍机械、可枚举的检查项，把资深评审的注意力留给架构与权衡，而不是代替资深评审拍板。",
    "mechanism": [
      "Agent 读取变更 diff、关联 issue 和受影响模块，建立评审上下文。",
      "按规则集逐项检查：风格规范、空值与边界、错误处理、安全基线和测试覆盖。",
      "对每条问题给出定位、原因和建议改法，并区分阻断级与提示级。",
      "Agent 把结论作为评审意见提交，资深评审对架构、权衡和业务正确性做最终判断。",
      "误报、漏检和被采纳的意见回流到规则集与评测，逐步收敛准确率。"
    ],
    "enterpriseCase": {
      "title": "评审 Agent 误报阻断合并",
      "scenario": "某团队把 Code Review Agent 设为合并强制门禁，覆盖日均约 400 个 PR。",
      "problem": "上线首周误报率约 35%，大量 PR 被错误阻断，工程师开始绕过评审直接合并。",
      "analysis": "规则集把提示级问题也设成阻断级，且没有按模块区分基线；Agent 被当成 gate 而非 assist，缺少人工豁免通道。",
      "solution": "把阻断级收敛到安全与正确性硬规则，其余降为提示；为评审 Agent 配置资深评审豁免；按误报回流持续调规则。",
      "takeaway": "评审 Agent 的定位是辅助初审，强制门禁会把工程师推向绕过。"
    },
    "pitfalls": [
      "把评审 Agent 当成强制门禁，提示级问题也阻断合并，反而逼工程师绕过评审。",
      "规则集不区分模块和阻断等级，导致误报率高、信噪比差。",
      "只看 Agent 报了多少问题，不看采纳率和漏检率，制造虚假安全感。",
      "评审意见不回流规则与评测，准确率长期无法收敛。"
    ],
    "diagnosticQuestion": {
      "id": "q-code-review-agent-1",
      "type": "single",
      "scenario": "Code Review Agent 上线后报出大量问题，但工程师采纳率不到 20%，多数被标记为误报，团队开始绕过评审。",
      "question": "最优先排查什么？",
      "options": [
        {
          "id": "a",
          "text": "是否需要更换更强的模型来提升评审质量"
        },
        {
          "id": "b",
          "text": "是否应该把评审 Agent 改成非强制，彻底取消门禁作用"
        },
        {
          "id": "c",
          "text": "规则集的阻断等级与模块基线是否合理，误报是否来自提示级被当成阻断"
        },
        {
          "id": "d",
          "text": "是否需要增加评审 Agent 能看到的上下文范围"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "C 是第一步：低采纳率和高误报通常源于规则等级与基线配置不当，把提示级当阻断。A 换模型不解决规则配置问题。B 直接取消门禁是过度反应，丢掉了有效覆盖。D 扩大上下文不针对误报根因。",
      "troubleshootingPath": [
        "统计误报来自哪些规则与模块",
        "区分阻断级与提示级，收敛硬规则",
        "按模块设定差异化基线",
        "建立资深评审豁免通道",
        "把误报回流规则集与评测"
      ],
      "relatedConceptIds": [
        "issue-fix-agent",
        "human-in-the-loop",
        "agent-loop",
        "eval",
        "test-generation-agent"
      ]
    },
    "keyTakeaways": [
      "评审 Agent 的价值在一致性与覆盖面，不在替代资深评审。",
      "阻断级要收敛到安全与正确性硬规则，其余降为提示。",
      "用采纳率和漏检率衡量，而不是报出的问题数量。",
      "误报与漏检必须回流规则集和评测才能收敛。"
    ],
    "relatedConceptIds": [
      "issue-fix-agent",
      "human-in-the-loop",
      "value-review-agent",
      "eval",
      "agent-loop"
    ]
  },
  {
    "id": "requirement-decomposition-agent",
    "title": "需求拆解 Agent",
    "slug": "requirement-decomposition-agent",
    "moduleId": "m5",
    "order": 3,
    "difficulty": "advanced",
    "estimatedMinutes": 11,
    "tags": [
      "需求拆解 Agent",
      "需求澄清",
      "验收标准",
      "返工率",
      "AI 原生软件工程"
    ],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "需求拆解 Agent 是把模糊的业务需求拆成边界清晰、可验收的工程子任务的 Agent。它的产出不是任务越多越好，而是每个子任务都有明确验收标准和依赖关系。",
    "whyItMatters": "需求模糊是研发返工的主要来源。需求拆解 Agent 能快速给出任务结构，但若缺少验收标准或过度拆解，会把模糊问题放大成一堆看似具体、实则无法验收的子任务，误导排期。",
    "mentalModel": "把它看成一名需求分析师：先把要做什么问清楚，再拆成能验收的小块，而不是急着把一句话需求拆成几十个任务卡。拆解质量看的是可验收性，不是数量。",
    "mechanism": [
      "Agent 读取原始需求、相关文档和历史相似需求，识别目标、约束和未明确点。",
      "对信息不足处主动标注澄清问题，而不是用假设直接拆解。",
      "把需求拆成子任务，每个子任务带验收标准、依赖关系和影响范围。",
      "标记风险与不确定子任务，区分可直接开发与需进一步确认的部分。",
      "拆解结果交人工确认，确认意见与返工回流到拆解模板。"
    ],
    "enterpriseCase": {
      "title": "过度拆解放大模糊需求",
      "scenario": "某团队用需求拆解 Agent 处理一句话需求，覆盖约 30 个产品需求/周。",
      "problem": "Agent 把一条模糊需求拆成 40 多个子任务，其中约 60% 缺少可验收标准，排期后返工率显著上升。",
      "analysis": "Agent 在需求未澄清时直接拆解，用假设填补空白，把模糊放大成大量无法验收的子任务，且未标注澄清点。",
      "solution": "强制 Agent 先输出澄清问题清单，确认后再拆解；每个子任务必须带验收标准；对不确定子任务单独标记不进排期。",
      "takeaway": "需求拆解先澄清再拆，可验收性比子任务数量更重要。"
    },
    "pitfalls": [
      "在需求未澄清时直接拆解，用假设填补空白，把模糊放大成一堆无法验收的子任务。",
      "追求子任务数量和粒度，却不给每个子任务定验收标准。",
      "不标注不确定与风险子任务，让它们和确定任务一起进排期。",
      "拆解结果不经人工确认就排期，返工意见也不回流模板。"
    ],
    "diagnosticQuestion": {
      "id": "q-requirement-decomposition-agent-1",
      "type": "single",
      "scenario": "需求拆解 Agent 把一句话需求拆成 40 多个子任务，排期后大量返工，团队发现多数子任务无法验收。",
      "question": "最优先应该改什么？",
      "options": [
        {
          "id": "a",
          "text": "先要求 Agent 在拆解前输出澄清问题，并为每个子任务强制带验收标准"
        },
        {
          "id": "b",
          "text": "先限制 Agent 每次最多拆成 10 个子任务"
        },
        {
          "id": "c",
          "text": "先换更强的模型让拆解更准确"
        },
        {
          "id": "d",
          "text": "先让 Agent 拆完后自动估算每个子任务工时"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "A 是第一步：返工根因是需求未澄清就拆解、子任务缺验收标准。B 限制数量治标不治本，模糊仍在。C 换模型不解决澄清缺失。D 在无法验收的任务上估工时没有意义。",
      "troubleshootingPath": [
        "检查拆解前是否做了需求澄清",
        "为每个子任务补验收标准",
        "标记不确定子任务不进排期",
        "人工确认拆解结果",
        "把返工回流拆解模板"
      ],
      "relatedConceptIds": [
        "spec-driven-development",
        "issue-fix-agent",
        "human-in-the-loop",
        "eval",
        "test-generation-agent"
      ]
    },
    "keyTakeaways": [
      "需求拆解先澄清再拆，不能用假设填补模糊。",
      "每个子任务必须带可验收标准，数量不是目标。",
      "不确定子任务要单独标记，不混进排期。",
      "返工意见应回流拆解模板持续改进。"
    ],
    "relatedConceptIds": [
      "spec-driven-development",
      "issue-fix-agent",
      "human-in-the-loop",
      "value-review-agent",
      "agents-md"
    ]
  },
  {
    "id": "test-generation-agent",
    "title": "测试生成 Agent",
    "slug": "test-generation-agent",
    "moduleId": "m5",
    "order": 4,
    "difficulty": "intermediate",
    "estimatedMinutes": 10,
    "tags": [
      "测试生成 Agent",
      "缺陷捕获率",
      "变异测试",
      "覆盖率",
      "AI 原生软件工程"
    ],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "测试生成 Agent 是根据代码、需求或缺陷自动生成测试用例的 Agent。它的关键不是把覆盖率拉高，而是生成能真正捕获缺陷的有效断言。",
    "whyItMatters": "测试生成能快速补齐用例，但覆盖率上涨不等于有效性上涨。空洞断言、只测正常路径、断言恒真的测试会制造覆盖率上升、缺陷照样漏的假象，反而拖慢回归，还会消耗团队对测试套件的信任。",
    "mentalModel": "把它看成一名测试工程师助手：先想清楚这段代码可能怎么坏，再写能验证它的断言，而不是为了凑覆盖率写一堆永远通过的测试。",
    "mechanism": [
      "Agent 分析被测代码、需求和已知缺陷，识别关键路径、边界和异常分支。",
      "针对每个场景生成测试用例，重点在有意义的断言而非仅调用覆盖。",
      "区分正常路径、边界条件和错误处理，避免只测正常路径。",
      "运行生成的测试，剔除恒真断言和不稳定测试。",
      "线上缺陷和漏测回流为新的测试场景，补强评测集。"
    ],
    "enterpriseCase": {
      "title": "覆盖率上升但缺陷照漏",
      "scenario": "某团队用测试生成 Agent 给核心模块补测试，单元测试覆盖率从 55% 升到 88%，覆盖约 1200 个函数。",
      "problem": "覆盖率大涨后，线上缺陷率几乎没下降，复盘发现约 40% 的生成测试断言空洞或恒真。",
      "analysis": "Agent 以覆盖率为目标生成测试，大量用例只调用函数不做有效断言，只覆盖正常路径，没覆盖边界和异常。",
      "solution": "把目标从覆盖率改为缺陷捕获率；引入变异测试评估断言有效性；剔除恒真断言；线上缺陷回流为测试场景。",
      "takeaway": "测试生成要看缺陷捕获率，覆盖率高不等于测得有效。"
    },
    "pitfalls": [
      "以覆盖率为目标生成测试，产出大量只调用不断言的空洞用例。",
      "只测正常路径，不覆盖边界和异常分支，漏掉真实缺陷。",
      "保留恒真断言和不稳定测试，让测试套件失去信号。",
      "只看覆盖率数字，不看缺陷捕获率，制造质量假象。"
    ],
    "diagnosticQuestion": {
      "id": "q-test-generation-agent-1",
      "type": "single",
      "scenario": "测试生成 Agent 把覆盖率从 55% 提到 88%，但线上缺陷率没有下降，复盘发现大量断言恒真。",
      "question": "最优先应该做什么？",
      "options": [
        {
          "id": "a",
          "text": "继续提高覆盖率到 95% 以上"
        },
        {
          "id": "b",
          "text": "增加测试生成 Agent 的运行频率"
        },
        {
          "id": "c",
          "text": "把生成的测试全部交人工重写"
        },
        {
          "id": "d",
          "text": "把目标从覆盖率改为缺陷捕获率，并用变异测试剔除恒真断言"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "D 是第一步：问题是断言无效而非覆盖不足，应改优化目标并用变异测试度量断言有效性。A 继续堆覆盖率会放大空洞测试。B 提高频率无助于有效性。C 全部人工重写成本过高且否定了 Agent 价值。",
      "troubleshootingPath": [
        "评估生成测试的断言有效性",
        "引入变异测试度量缺陷捕获",
        "剔除恒真和不稳定断言",
        "补齐边界与异常用例",
        "把线上缺陷回流为测试场景"
      ],
      "relatedConceptIds": [
        "issue-fix-agent",
        "code-review-agent",
        "eval",
        "human-in-the-loop",
        "agent-loop"
      ]
    },
    "keyTakeaways": [
      "测试生成的目标是缺陷捕获率，不是覆盖率。",
      "有效断言比调用覆盖更重要，要覆盖边界和异常。",
      "用变异测试评估断言有效性，剔除恒真用例。",
      "线上缺陷应回流为新的测试场景。"
    ],
    "relatedConceptIds": [
      "issue-fix-agent",
      "code-review-agent",
      "eval",
      "value-review-agent",
      "spec-driven-development"
    ]
  },
  {
    "id": "ops-diagnosis-agent",
    "title": "运维诊断 Agent",
    "slug": "ops-diagnosis-agent",
    "moduleId": "m5",
    "order": 5,
    "difficulty": "advanced",
    "estimatedMinutes": 11,
    "tags": [
      "运维诊断 Agent",
      "MTTR",
      "根因假设",
      "权限收敛",
      "AI 原生软件工程"
    ],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "运维诊断 Agent 是在故障发生时聚合告警、日志、指标和变更，生成根因假设与排查路径的 Agent。它的定位是缩短 MTTR 的假设生成器，而非自动处置。",
    "whyItMatters": "线上故障的代价随定位时间放大。运维诊断 Agent 能快速收敛排查方向，但若给它自动处置的写权限，一旦误诊就会把诊断错误变成二次故障，因此写权限必须严格收敛。",
    "mentalModel": "把它看成一名值班 SRE 助手：它快速把可疑线索摆到你面前并给出假设，但要不要重启、要不要回滚这种动作，仍由人按权限决定。",
    "mechanism": [
      "Agent 聚合告警、日志、指标和近期变更，构建故障时间线。",
      "基于异常模式和变更关联生成多个根因假设，并按置信度排序。",
      "为每个假设给出验证步骤和需要的观测数据。",
      "默认只读：Agent 提出处置建议，实际写操作走人工审批或受限权限。",
      "误诊、漏诊和真实根因回流到诊断模板与评测集。"
    ],
    "enterpriseCase": {
      "title": "自动处置把误诊变成二次故障",
      "scenario": "某平台给运维诊断 Agent 开放了自动重启和回滚权限，覆盖约 300 个服务。",
      "problem": "一次告警中 Agent 误判根因为某服务过载，自动回滚了无关变更，导致故障范围从 1 个服务扩大到 6 个。",
      "analysis": "Agent 在根因未经验证时就执行了高风险写操作，缺少人工审批和权限边界；诊断假设没有先验证就处置。",
      "solution": "收回自动写权限，Agent 默认只读只给假设；高风险处置走人工审批；按假设置信度分级，只有低风险动作可受限自动执行。",
      "takeaway": "诊断 Agent 默认只读，写权限不收敛就会把误诊放大成事故。"
    },
    "pitfalls": [
      "给诊断 Agent 开放自动处置写权限，一旦误诊就把诊断错误放大成二次故障。",
      "在根因未验证时就执行高风险动作，跳过假设验证步骤。",
      "只给单一根因结论，不给多个假设和验证路径，误导排查方向。",
      "误诊和真实根因不回流模板，诊断准确率长期不提升。"
    ],
    "diagnosticQuestion": {
      "id": "q-ops-diagnosis-agent-1",
      "type": "single",
      "scenario": "运维诊断 Agent 被授予自动回滚权限，一次误判根因后自动回滚无关变更，把单服务故障扩大到 6 个服务。",
      "question": "最优先应该做什么？",
      "options": [
        {
          "id": "a",
          "text": "提高诊断 Agent 的模型能力以减少误判"
        },
        {
          "id": "b",
          "text": "收回自动写权限，让 Agent 默认只读、只给假设，高风险处置走人工审批"
        },
        {
          "id": "c",
          "text": "增加更多告警和日志数据源给 Agent"
        },
        {
          "id": "d",
          "text": "为回滚动作增加一次自动重试以确认效果"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "B 是第一步：根本问题是高风险写权限未收敛，误诊被直接执行。A 即使误判减少，未验证就处置的结构性风险仍在。C 增加数据不解决权限问题。D 自动重试会进一步扩大误操作。",
      "troubleshootingPath": [
        "收回 Agent 的高风险写权限",
        "把处置动作改为人工审批",
        "要求根因假设先验证再处置",
        "按风险分级受限授权",
        "把误诊回流诊断模板"
      ],
      "relatedConceptIds": [
        "permission-governance",
        "human-in-the-loop",
        "trace",
        "observability",
        "issue-fix-agent"
      ]
    },
    "keyTakeaways": [
      "运维诊断 Agent 是缩短 MTTR 的假设生成器，不是自动处置器。",
      "高风险写权限必须收敛，默认只读。",
      "根因假设要先验证再处置，并给出多个候选。",
      "误诊与真实根因应回流模板提升准确率。"
    ],
    "relatedConceptIds": [
      "permission-governance",
      "human-in-the-loop",
      "trace",
      "observability",
      "issue-fix-agent"
    ]
  },
  {
    "id": "value-review-agent",
    "title": "价值复盘 Agent",
    "slug": "value-review-agent",
    "moduleId": "m5",
    "order": 6,
    "difficulty": "intermediate",
    "estimatedMinutes": 10,
    "tags": [
      "价值复盘 Agent",
      "采纳率",
      "ROI",
      "虚荣指标",
      "AI 原生软件工程"
    ],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "价值复盘 Agent 是在任务或迭代结束后，评估 AI 产出的实际价值、采纳率和成本，并把经验回流到模板、Skill 和评测集的 Agent。它是 AI 原生研发的闭环收口。",
    "whyItMatters": "很多团队只统计 AI 生成了多少，却不评估有多少真正被采纳、带来多少价值、花了多少成本。价值复盘 Agent 把产出与采纳、成本、ROI 对齐，避免用生成量这种虚荣指标自我感觉良好。",
    "mentalModel": "把它看成一次结构化复盘会的主持人：不问 AI 干了多少活，而问哪些被真正采纳、省了什么、花了多少、下次怎么更好，并把结论沉淀成可复用资产。",
    "mechanism": [
      "Agent 收集任务产出、采纳情况、返工记录和 Token 成本。",
      "计算采纳率、返工率和单位价值成本，区分高价值与低价值场景。",
      "识别反复出现的失败模式和高价值用法。",
      "把经验回流为模板、Skill、评测样本和规则更新。",
      "向负责人输出价值与成本视图，支撑是否扩大或收缩使用的判断。"
    ],
    "enterpriseCase": {
      "title": "只看生成量的虚荣指标",
      "scenario": "某研发组织用生成量考核 AI 工具效果，覆盖约 500 名工程师。",
      "problem": "报表显示 AI 月生成 12 万行代码，但复盘发现实际采纳率不足 30%，部分场景返工成本反超收益。",
      "analysis": "组织用生成量这种虚荣指标衡量价值，没有对齐采纳率、返工和成本，导致低价值场景被持续投入。",
      "solution": "引入价值复盘 Agent，按采纳率、返工率和单位价值成本评估；低价值场景收缩，高价值场景沉淀 Skill；用 ROI 视图决策。",
      "takeaway": "衡量 AI 价值要看采纳率和 ROI，而不是生成量。"
    },
    "pitfalls": [
      "用生成量、行数这种虚荣指标衡量价值，掩盖真实采纳率和成本。",
      "只复盘成功案例，不识别反复出现的失败模式，经验无法沉淀。",
      "复盘结论停留在文档，不回流为模板、Skill 和评测，下次照样踩坑。",
      "不算返工和 Token 成本，把负 ROI 场景误判为有价值。"
    ],
    "diagnosticQuestion": {
      "id": "q-value-review-agent-1",
      "type": "single",
      "scenario": "某组织用 AI 月生成 12 万行代码汇报成效，但实际采纳率不足 30%，部分场景返工成本超过收益。",
      "question": "最优先应该改什么？",
      "options": [
        {
          "id": "a",
          "text": "继续提高 AI 的代码生成量"
        },
        {
          "id": "b",
          "text": "暂停所有 AI 工具的使用，回到纯人工开发"
        },
        {
          "id": "c",
          "text": "把衡量指标从生成量改为采纳率、返工率和单位价值成本，并据此收缩低价值场景"
        },
        {
          "id": "d",
          "text": "给每个工程师设定 AI 生成量的考核目标"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "C 是第一步：根因是用生成量这种虚荣指标衡量价值，应改为采纳率与 ROI 并据此调整投入。A、D 继续强化错误指标。B 一刀切停用丢掉了高价值场景，属于过度反应。",
      "troubleshootingPath": [
        "停用生成量作为价值指标",
        "统计采纳率、返工率和成本",
        "区分高价值与负 ROI 场景",
        "收缩低价值、沉淀高价值用法",
        "把经验回流模板与评测"
      ],
      "relatedConceptIds": [
        "token-roi",
        "eval",
        "issue-fix-agent",
        "human-in-the-loop",
        "ai-native-org"
      ]
    },
    "keyTakeaways": [
      "价值复盘看采纳率和 ROI，不看生成量。",
      "要识别反复失败模式，而不只复盘成功。",
      "复盘结论必须回流模板、Skill 和评测。",
      "负 ROI 场景应收缩，高价值场景应沉淀。"
    ],
    "relatedConceptIds": [
      "token-roi",
      "eval",
      "issue-fix-agent",
      "ai-native-org",
      "code-review-agent"
    ]
  },
  {
    "id": "eval",
    "title": "Eval",
    "slug": "eval",
    "moduleId": "m6",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 12,
    "tags": [
      "Eval",
      "评测集",
      "回归测试",
      "质量度量",
      "AI 治理"
    ],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "Eval 是用离线评测集和在线指标系统性衡量 AI 系统质量的方法。它是 AI 系统的测试套件，核心原则是先有评测再上线，让质量变化可度量、可回归。",
    "whyItMatters": "AI 系统的质量不像传统软件可以靠单测穷举，输出是概率性的。没有评测集，模型升级、提示词改动和数据变化的影响就无法量化，只能靠主观感觉；先上线再补评测，等于在没有回归测试的情况下持续改动生产系统。",
    "mentalModel": "把 Eval 看成 AI 系统的回归测试套件：每次改动前先在固定评测集上跑一遍，看质量是涨是跌，而不是上线后等用户投诉。评测集就是你对什么叫好的可执行定义。",
    "mechanism": [
      "构建覆盖典型与边界场景的评测集，标注期望输出或评分标准，规模通常从数百到数千条起步。",
      "选择评分方式：规则匹配、人工标注或模型评审，并校准评审与人工的一致性。",
      "每次模型、提示词或数据变更前在评测集上回归，量化质量变化。",
      "在线补充真实流量指标，监控离线评测覆盖不到的长尾问题。",
      "线上失败样本回流评测集，让评测集随业务持续演进。"
    ],
    "enterpriseCase": {
      "title": "先上线后补评测的代价",
      "scenario": "某企业客服 Agent 直接上线，未建评测集，覆盖日均约 5 万次会话。",
      "problem": "一次提示词优化后整体满意度不升反降，因为没有评测集，团队两周后才从投诉中发现质量回退。",
      "analysis": "缺少离线评测集，提示词改动的质量影响无法在上线前量化，只能靠线上投诉这种滞后信号发现回退。",
      "solution": "建立约 800 条覆盖典型与边界场景的评测集（参考量级），改动前必跑回归；校准模型评审与人工一致性；线上失败样本回流评测集。",
      "takeaway": "评测要先于上线，没有评测集的改动等于无回归测试改生产。"
    },
    "pitfalls": [
      "先上线再补评测，质量回退只能靠线上投诉这种滞后信号发现。",
      "评测集只覆盖典型场景，不含边界和失败样本，漏掉真实风险。",
      "用模型评审却不校准与人工的一致性，把不可靠评分当权威。",
      "评测集一成不变，不随线上失败样本演进，逐渐与业务脱节。"
    ],
    "diagnosticQuestion": {
      "id": "q-eval-1",
      "type": "single",
      "scenario": "某客服 Agent 一次提示词优化后满意度不升反降，团队两周后才从投诉中发现，此前没有任何评测集。",
      "question": "最优先应该建立什么？",
      "options": [
        {
          "id": "a",
          "text": "先建覆盖典型与边界场景的评测集，把改动前回归作为上线前置条件"
        },
        {
          "id": "b",
          "text": "先回滚这次提示词改动，恢复到上一个版本"
        },
        {
          "id": "c",
          "text": "先增加线上满意度采集的频率"
        },
        {
          "id": "d",
          "text": "先换一个更强的模型来提升整体质量"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "A 是第一步：根因是缺少评测集导致改动质量无法在上线前量化。B 回滚只解决这一次，下次照样盲改。C 提高采集频率仍是滞后信号。D 换模型在没有评测的情况下同样无法验证好坏。",
      "troubleshootingPath": [
        "构建覆盖典型与边界的评测集",
        "标注期望输出与评分标准",
        "把改动前回归设为上线前置",
        "校准模型评审与人工一致性",
        "线上失败样本回流评测集"
      ],
      "relatedConceptIds": [
        "value-review-agent",
        "observability",
        "token-roi",
        "human-in-the-loop",
        "code-review-agent"
      ]
    },
    "keyTakeaways": [
      "Eval 是 AI 系统的回归测试，必须先于上线。",
      "评测集要覆盖边界和失败样本，不只典型场景。",
      "模型评审必须与人工校准一致性才可信。",
      "评测集要随线上失败样本持续演进。"
    ],
    "relatedConceptIds": [
      "value-review-agent",
      "observability",
      "token-roi",
      "trace",
      "human-in-the-loop"
    ]
  },
  {
    "id": "trace",
    "title": "Trace",
    "slug": "trace",
    "moduleId": "m6",
    "order": 2,
    "difficulty": "advanced",
    "estimatedMinutes": 10,
    "tags": [
      "Trace",
      "Span",
      "调用链",
      "可追溯",
      "AI 治理"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "Trace 是把一次 AI 请求从提示组装、工具调用到子 Agent 和最终输出的链路证据结构化串联起来。它是排障与归因的原子单位，但不是原文日志仓库。",
    "whyItMatters": "AI 系统的失败常发生在中间环节：提示组装错、工具返回脏数据、子 Agent 偏题。没有 trace，你只能看到最终错误答案，无法定位是哪一步出问题；但 trace 也可能收进 PII、凭证、客户数据、内部代码和模型输出，因此必须把可追溯性与数据最小化一起设计。",
    "mentalModel": "把 trace 看成一次请求的脱敏病历：每个 span 记录诊断所需的结构化证据、引用 id 和摘要，而不是把病人的所有原始材料无限期塞进档案室。",
    "mechanism": [
      "为一次请求分配唯一 trace id，串联其下所有处理步骤。",
      "每个步骤记录为一个 span：阶段、耗时、模型或工具版本、错误码、权限上下文、引用 id、hash 和脱敏摘要。",
      "提示组装、工具调用、子 Agent 调用都作为子 span 挂在链路上，但原文输入输出按敏感级别禁采、脱敏或限权保存。",
      "采样策略平衡成本、覆盖和合规，高风险或异常请求可高覆盖采样，但必须有保留期、访问控制、租户隔离和敏感字段过滤。",
      "trace 关联评测和告警，定位是哪一步导致质量或延迟问题。"
    ],
    "animation": {
      "type": "observability-trace",
      "title": "从 trace id 到失败 span 定位",
      "steps": [
        {
          "id": "s1",
          "title": "请求获得 trace id",
          "description": "一次 AI 请求先被分配唯一 trace id，后续每个处理环节都挂在同一条链路下。",
          "highlightTargets": ["request", "trace-id"]
        },
        {
          "id": "s2",
          "title": "提示与上下文成为 span",
          "description": "提示组装、历史上下文和检索片段以引用 id、hash、版本和脱敏摘要进入 span，方便判断错误是否来自输入侧。",
          "highlightTargets": ["prompt", "context", "span"]
        },
        {
          "id": "s3",
          "title": "工具和子 Agent 继续挂链",
          "description": "工具调用和子 Agent 作为子 span 保存安全参数摘要、工具版本、审批 id、错误码和耗时。",
          "highlightTargets": ["tool", "agent", "subagent", "span"]
        },
        {
          "id": "s4",
          "title": "最终输出关联质量信号",
          "description": "最终回答与评测或用户反馈关联，错误答案可以沿 trace 回看每个中间环节。",
          "highlightTargets": ["output", "quality", "eval"]
        },
        {
          "id": "s5",
          "title": "异常请求高覆盖采样并下钻",
          "description": "当质量或延迟异常时，系统保留脱敏 trace 并下钻到失败 span，同时执行访问控制、保留期和租户隔离。",
          "highlightTargets": ["alert", "drilldown"]
        }
      ]
    },
    "enterpriseCase": {
      "title": "无 trace 导致归因困难",
      "scenario": "某多步 Agent 系统偶发错误答案，调用链含提示组装、3 个工具和 2 个子 Agent，日均约 8 万次请求。",
      "problem": "错误率约 4%，但因为只记录最终输出，团队无法定位错误来自哪一步，排查一个 case 平均耗时数小时。",
      "analysis": "系统没有按 trace 和 span 记录中间环节，最终答案错误时无法回溯是提示、工具还是子 Agent 出问题；若直接补原文日志，又会引入隐私、凭证和客户数据泄漏风险。",
      "solution": "引入 trace id 与 span 记录结构化证据、引用 id、hash、耗时、版本和脱敏摘要；异常请求高覆盖采样但受保留期、访问控制、租户隔离和敏感字段过滤约束；trace 关联评测，把高频失败 span 定位出来。",
      "takeaway": "调用链越长，trace 越是排障的前提；越接近生产客户数据，越要同时设计最小化和脱敏边界。"
    },
    "pitfalls": [
      "只记录最终输出，不记录中间步骤，出错时无法定位是哪一环。",
      "span 粒度太粗，把提示组装和工具调用混成一步，丢失关键信息。",
      "为省成本对所有请求统一低采样，异常请求也采不到。",
      "trace 与评测、告警割裂，记录了却不用于定位质量问题。"
    ],
    "diagnosticQuestion": {
      "id": "q-trace-1",
      "type": "single",
      "scenario": "某多步 Agent 系统错误率约 4%，但只记录最终输出，每排查一个错误 case 要数小时，无法确定是提示、工具还是子 Agent 的问题。",
      "question": "最优先应该做什么？",
      "options": [
        {
          "id": "a",
          "text": "提高整体模型能力以降低错误率"
        },
        {
          "id": "b",
          "text": "增加更多工具让 Agent 有更多选择"
        },
        {
          "id": "c",
          "text": "对所有请求统一降低采样率以节省成本"
        },
        {
          "id": "d",
          "text": "引入 trace id 和 span 记录结构化证据与脱敏摘要，异常请求高覆盖采样"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "D 是第一步：排障困难的根因是中间链路不可见，必须先让每一步可追溯。但可追溯不等于原文全量入库，span 应记录结构化证据、脱敏摘要、引用 id、耗时、版本和错误码，并对异常请求做带访问控制、保留期和租户隔离的高覆盖采样。A 降错误率但定位问题仍靠猜。B 增加工具反而加长链路。C 降采样会让异常更采不到，方向相反。",
      "troubleshootingPath": [
        "为请求分配 trace id",
        "按 span 记录结构化证据、脱敏摘要、版本、错误码与耗时",
        "对异常请求高覆盖采样，并设置保留期、访问控制和租户隔离",
        "trace 关联评测定位失败 span",
        "按高频失败 span 优化，并定期审查采集字段是否仍有必要"
      ],
      "relatedConceptIds": [
        "observability",
        "eval",
        "ops-diagnosis-agent",
        "multi-agent",
        "tool-calling"
      ]
    },
    "keyTakeaways": [
      "Trace 是排障与归因的原子单位。",
      "span 粒度要细到能区分提示、工具和子 Agent。",
      "异常和高风险请求可高覆盖采样，但必须先定义脱敏、保留期、访问控制和租户隔离。",
      "trace 要关联评测和告警，也要遵守敏感数据最小化。"
    ],
    "relatedConceptIds": [
      "observability",
      "eval",
      "ops-diagnosis-agent",
      "multi-agent",
      "tool-calling"
    ]
  },
  {
    "id": "observability",
    "title": "Observability",
    "slug": "observability",
    "moduleId": "m6",
    "order": 3,
    "difficulty": "advanced",
    "estimatedMinutes": 11,
    "tags": [
      "Observability",
      "质量监控",
      "告警",
      "可观测性",
      "AI 治理"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "Observability 是把 trace、指标、日志、评测、反馈、版本和成本信号组合成系统级视图，让团队持续看见 AI 系统真实运行状态的能力。",
    "whyItMatters": "传统监控盯的是延迟、错误率和资源，但 AI 系统可以全程不报错却持续给出低质量答案。没有质量维度的可观测，劣化会在指标全绿的情况下悄悄发生，等用户流失才被发现。",
    "mentalModel": "把 AI 可观测看成一张控制台：指标看趋势，日志看事件，trace 负责下钻，评测和反馈判断答案质量，版本与成本解释变化从哪里来。",
    "mechanism": [
      "汇总 metrics、logs、traces、eval signals、用户反馈、版本和成本，形成质量、延迟、可靠性与成本视图。",
      "质量维度接入在线评测或用户反馈，监控答非所问、拒答和事实错误。",
      "为质量回退、延迟和成本异常设告警，而不只盯资源指标。",
      "按应用、模型、版本切分，定位劣化来自哪个变更。",
      "异常会话下钻到脱敏 trace，把系统级信号连回单次请求，同时保留数据最小化边界。"
    ],
    "animation": {
      "type": "observability-trace",
      "title": "从单次 trace 到质量可观测",
      "steps": [
        {
          "id": "s1",
          "title": "trace 提供链路证据",
          "description": "系统从 metrics、logs 和脱敏 trace 中获得请求链路、工具、子 Agent、输出质量和耗时证据。",
          "highlightTargets": ["request", "prompt", "tool", "agent", "output"]
        },
        {
          "id": "s2",
          "title": "聚合质量指标",
          "description": "在线评测、用户反馈和事实错误率进入质量维度，补上传统 APM 看不到的答案好坏。",
          "highlightTargets": ["quality", "eval", "dashboard"]
        },
        {
          "id": "s3",
          "title": "延迟与成本并列观察",
          "description": "延迟分布、TTFT、Token 成本和失败率与质量一起看，避免只优化单一指标。",
          "highlightTargets": ["latency", "cost", "dashboard"]
        },
        {
          "id": "s4",
          "title": "质量回退触发告警",
          "description": "当事实错误率或质量评分越过阈值时，告警应像延迟告警一样进入值班和治理流程。",
          "highlightTargets": ["alert", "quality"]
        },
        {
          "id": "s5",
          "title": "下钻到异常 trace",
          "description": "系统级异常最终要能回到单次脱敏 trace，定位是知识库版本、工具返回还是提示组装导致劣化。",
          "highlightTargets": ["drilldown", "trace-id", "span"]
        }
      ]
    },
    "enterpriseCase": {
      "title": "指标全绿但质量在劣化",
      "scenario": "某 RAG 问答系统延迟和错误率监控长期正常，覆盖日均约 10 万次问答。",
      "problem": "一次知识库更新后事实错误率从约 3% 升到 11%，但传统监控全绿，三周后才因业务方反馈发现。",
      "analysis": "可观测只有延迟和错误率，没有质量、评测、反馈和知识库版本维度；系统不报错地给出错误答案，劣化在指标层面完全不可见。",
      "solution": "补上质量仪表盘：接入在线评测和用户反馈监控事实错误率；为质量回退设告警；按知识库、模型和提示版本切分定位；异常会话下钻脱敏 trace。",
      "takeaway": "AI 可观测必须含质量维度，不报错不等于没问题。"
    },
    "pitfalls": [
      "只监控延迟、错误率和资源，没有质量维度，劣化在指标全绿时悄悄发生。",
      "质量只靠人工抽查，没有持续在线信号，发现总是滞后。",
      "不按应用、模型和版本切分，劣化发生却定位不到来源。",
      "系统级告警无法下钻到脱敏 trace，看见异常却查不到根因。"
    ],
    "diagnosticQuestion": {
      "id": "q-observability-1",
      "type": "single",
      "scenario": "某 RAG 系统延迟和错误率监控长期全绿，但一次知识库更新后事实错误率从 3% 升到 11%，三周后才被业务方发现。",
      "question": "可观测体系最缺的是什么？",
      "options": [
        {
          "id": "a",
          "text": "更低的延迟监控阈值"
        },
        {
          "id": "b",
          "text": "质量维度的持续监控，比如在线事实错误率与质量回退告警"
        },
        {
          "id": "c",
          "text": "更多的服务器资源监控指标"
        },
        {
          "id": "d",
          "text": "更高频的人工抽查"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "B 是核心：失败被忽视的根因是可观测缺少质量维度，系统不报错地答错。A、C 仍在传统资源与延迟维度，覆盖不到质量。D 人工抽查无法持续且滞后，正是要被在线质量信号替代的。",
      "troubleshootingPath": [
        "接入在线评测作为质量信号",
        "为事实错误率与质量回退设告警",
        "按应用、模型、版本切分指标",
        "异常会话下钻到脱敏 trace",
        "把质量纳入常态仪表盘"
      ],
      "relatedConceptIds": [
        "trace",
        "eval",
        "ops-diagnosis-agent",
        "token-roi",
        "sla"
      ]
    },
    "keyTakeaways": [
      "AI 可观测必须包含质量维度，不只延迟和资源。",
      "质量要有持续在线信号，而非人工滞后抽查。",
      "指标要按应用、模型、版本切分以定位劣化。",
      "系统级异常要能下钻到 trace 找根因。"
    ],
    "relatedConceptIds": [
      "trace",
      "eval",
      "ops-diagnosis-agent",
      "token-roi",
      "sla"
    ]
  },
  {
    "id": "token-roi",
    "title": "Token ROI",
    "slug": "token-roi",
    "moduleId": "m6",
    "order": 4,
    "difficulty": "advanced",
    "estimatedMinutes": 12,
    "tags": [
      "Token ROI",
      "单位经济学",
      "成本治理",
      "成本质量曲线",
      "AI 治理"
    ],
    "contentStatus": "mvp",
    "hasAnimation": true,
    "definition": "Token ROI 是把 Token 成本对齐到业务价值来评估 AI 投入是否划算的方法。它反对两个极端：既不为省 Token 牺牲质量，也不为堆质量无视成本，而是看单位价值的成本。",
    "whyItMatters": "Token 成本会随调用量、上下文长度和多 Agent 线性甚至成倍增长。只看总成本会盲目压缩、伤害质量；只看质量会让成本失控。负责人需要的是成本与价值对齐的判断，决定哪些场景该投入、哪些该收缩或换小模型。",
    "mentalModel": "把 Token ROI 看成 AI 场景的单位经济学：每个场景算清楚一次任务花多少 Token、产出多少可量化价值，再决定加码、维持还是砍掉，而不是用总账单或总质量一刀切。",
    "mechanism": [
      "按场景统计单位任务的输入与输出 Token 及调用成本。",
      "把成本对齐到可量化价值：节省工时、转化提升或人力替代。",
      "计算成本与质量曲线，找到边际收益递减的拐点。",
      "对高成本低价值场景换小模型、压上下文或下线。",
      "用缓存命中、提示精简和路由把成本压在不伤质量的范围。"
    ],
    "animation": {
      "type": "token-roi-flow",
      "title": "按场景计算 Token ROI",
      "steps": [
        {
          "id": "s1",
          "title": "先按场景拆账",
          "description": "不要看总账单，先把客服、研发、分析等场景拆开，分别统计单位任务。",
          "highlightTargets": ["scenario"]
        },
        {
          "id": "s2",
          "title": "统计输入与输出 Token 成本",
          "description": "每个场景记录输入 Token、输出 Token 和模型单价，得到一次任务的真实成本。",
          "highlightTargets": ["token-cost", "input-token", "output-token"]
        },
        {
          "id": "s3",
          "title": "对齐业务价值与质量",
          "description": "把成本和节省工时、转化提升、人力替代以及质量评分放在同一个场景维度里比较。",
          "highlightTargets": ["business-value", "quality"]
        },
        {
          "id": "s4",
          "title": "找到成本质量曲线拐点",
          "description": "当继续增加 Token 带来的质量收益变小，就到了需要路由或压缩的边际收益拐点。",
          "highlightTargets": ["roi", "curve"]
        },
        {
          "id": "s5",
          "title": "按 ROI 决定投入与收缩",
          "description": "高价值场景保质量，低价值或负 ROI 场景才换小模型、压上下文或下线。",
          "highlightTargets": ["decision", "keep-quality", "compress"]
        },
        {
          "id": "s6",
          "title": "用工程手段降本不伤质",
          "description": "缓存命中、能力路由和提示精简用于压低成本，但边界是不能破坏核心场景质量。",
          "highlightTargets": ["cache", "routing", "prompt-trim"]
        }
      ]
    },
    "enterpriseCase": {
      "title": "为省 Token 反伤质量的伪优化",
      "scenario": "某企业为压成本统一把所有场景换成小模型并截断上下文，覆盖约 20 个业务场景。",
      "problem": "Token 成本月降约 40%，但核心场景准确率下降导致人工返工增加，综合成本反而上升。",
      "analysis": "优化只看 Token 总成本，没有对齐每个场景的价值；在高价值场景上牺牲质量，省下的 Token 远小于返工代价。",
      "solution": "按场景算 Token ROI：高价值场景保留大模型，低价值场景换小模型或下线；用缓存和提示精简在不伤质量处省成本。",
      "takeaway": "Token 优化要按场景看 ROI，全局压缩会在高价值处反伤价值。"
    },
    "pitfalls": [
      "只看 Token 总成本不看价值，全局压缩在高价值场景反伤质量。",
      "只追求质量不算成本，让低价值场景的 Token 开销失控。",
      "用统一模型和上下文策略，不区分场景的价值与成本差异。",
      "不监控缓存命中和上下文膨胀，成本悄悄随调用量成倍增长。"
    ],
    "diagnosticQuestion": {
      "id": "q-token-roi-1",
      "type": "single",
      "scenario": "某企业把所有场景统一换小模型并截断上下文，Token 成本月降 40%，但核心场景因准确率下降导致返工增加，综合成本反而上升。",
      "question": "最优先应该怎么做？",
      "options": [
        {
          "id": "a",
          "text": "继续把更多场景换成更小的模型以进一步降成本"
        },
        {
          "id": "b",
          "text": "全部换回大模型并恢复完整上下文"
        },
        {
          "id": "c",
          "text": "按场景计算 Token ROI，高价值场景保质量、低价值场景才压缩"
        },
        {
          "id": "d",
          "text": "统一给所有场景增加上下文长度以提升质量"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "C 是正解：问题是用全局压缩取代了按场景的价值判断。A 继续全局压缩会加重高价值场景损失。B 全换回大模型又回到不看成本的另一极端。D 统一加长上下文同样无视场景差异且推高成本。",
      "troubleshootingPath": [
        "按场景统计单位任务 Token 成本",
        "把成本对齐到可量化价值",
        "识别高价值与负 ROI 场景",
        "高价值保质量、低价值再压缩",
        "用缓存和提示精简降本不伤质"
      ],
      "relatedConceptIds": [
        "token",
        "cost-routing",
        "value-review-agent",
        "eval",
        "kv-cache"
      ]
    },
    "keyTakeaways": [
      "Token ROI 看单位价值的成本，不看总账单。",
      "全局压缩会在高价值场景反伤价值。",
      "按场景区分投入：高价值保质量、低价值压缩。",
      "用缓存和提示精简在不伤质量处降本。"
    ],
    "relatedConceptIds": [
      "token",
      "cost-routing",
      "value-review-agent",
      "eval",
      "kv-cache"
    ]
  },
  {
    "id": "permission-governance",
    "title": "权限治理",
    "slug": "permission-governance",
    "moduleId": "m6",
    "order": 5,
    "difficulty": "advanced",
    "estimatedMinutes": 11,
    "tags": [
      "权限治理",
      "最小权限",
      "审批边界",
      "可审计",
      "AI 治理"
    ],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "权限治理是为 AI Agent 设定最小权限、审批边界和可审计记录，确保它只能在授权范围内行动的机制。Agent 能自动执行动作，权限就是它不越界的护栏。",
    "whyItMatters": "Agent 越自动，误操作和被滥用的影响越大：删库、对外发送、资金操作、权限变更都可能被一次错误判断触发。没有最小权限和审批边界，一个提示注入或误判就可能造成真实事故，且事后无法审计追责。",
    "mentalModel": "把 Agent 的权限治理看成给一名能力很强但可能犯错的新员工配工卡：默认只给完成任务所需的最小门禁，高风险动作要审批，所有操作留痕，而不是直接给管理员权限。",
    "mechanism": [
      "按角色和任务给 Agent 分配最小权限，默认只读，写权限单独申请。",
      "对高风险动作（删除、对外、资金、权限变更）设强制人工审批。",
      "所有 Agent 操作记录可审计日志，含发起者、动作、对象和依据。",
      "用沙箱和速率限制约束爆炸半径，防止误操作或注入被放大。",
      "定期复核权限，回收不再需要的授权，越权尝试触发告警。"
    ],
    "enterpriseCase": {
      "title": "过度授权放大注入风险",
      "scenario": "某企业给数据分析 Agent 直接授予生产库读写权限，覆盖约 50 名分析师使用。",
      "problem": "一次被构造的提示注入诱导 Agent 执行了批量删除，因权限过大影响 3 张核心表，且日志不足难以追责。",
      "analysis": "Agent 被授予远超任务所需的写权限，没有审批边界和爆炸半径限制；操作日志不完整，事后无法追溯。",
      "solution": "收敛到最小权限默认只读；写和删除走人工审批；接入完整审计日志；用沙箱和速率限制约束爆炸半径。",
      "takeaway": "Agent 越自动，最小权限和审批边界越是不可省的护栏。"
    },
    "pitfalls": [
      "给 Agent 远超任务所需的权限，一次误判或注入就造成大范围破坏。",
      "高风险动作没有人工审批边界，写、删、对外操作可被自动触发。",
      "操作日志不完整，出事后无法审计追责。",
      "授权一次发放不再复核，长期累积出大量无人回收的权限。"
    ],
    "diagnosticQuestion": {
      "id": "q-permission-governance-1",
      "type": "single",
      "scenario": "某数据分析 Agent 被授予生产库读写权限，一次提示注入诱导它批量删除，影响 3 张核心表，事后因日志不足难以追责。",
      "question": "最优先应该做什么？",
      "options": [
        {
          "id": "a",
          "text": "收敛到最小权限默认只读，高风险写或删动作走人工审批并接入完整审计日志"
        },
        {
          "id": "b",
          "text": "提高模型的安全对齐能力以抵抗注入"
        },
        {
          "id": "c",
          "text": "增加 Agent 可访问的数据表以提升分析能力"
        },
        {
          "id": "d",
          "text": "给 Agent 增加一次自我确认的提示步骤"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "A 是第一步：根因是权限过大且无审批与审计，必须先收敛权限、加审批边界和留痕。B 安全对齐有帮助但抵不住权限本身过大。C 方向相反。D 让 Agent 自我确认无法替代真正的权限边界和人工审批。",
      "troubleshootingPath": [
        "收敛 Agent 到最小权限默认只读",
        "高风险动作设人工审批",
        "接入完整可审计日志",
        "用沙箱和速率限制爆炸半径",
        "定期复核回收冗余授权"
      ],
      "relatedConceptIds": [
        "ops-diagnosis-agent",
        "human-in-the-loop",
        "trace",
        "observability",
        "tool-calling"
      ]
    },
    "keyTakeaways": [
      "Agent 默认最小权限，写权限单独申请。",
      "高风险动作必须有人工审批边界。",
      "所有操作要留可审计日志以便追责。",
      "用沙箱和速率限制约束爆炸半径。"
    ],
    "relatedConceptIds": [
      "ops-diagnosis-agent",
      "human-in-the-loop",
      "trace",
      "observability",
      "tool-calling"
    ]
  },
  {
    "id": "ai-native-org",
    "title": "AI 原生组织阵型",
    "slug": "ai-native-org",
    "moduleId": "m6",
    "order": 6,
    "difficulty": "advanced",
    "estimatedMinutes": 12,
    "tags": [
      "AI 原生组织",
      "人机分工",
      "责任归属",
      "组织阵型",
      "AI 治理"
    ],
    "contentStatus": "mvp",
    "hasAnimation": false,
    "definition": "AI 原生组织阵型是指随着 Agent 进入研发闭环，团队的角色、责任和人审分布如何重新设计。它的核心问题不是减多少人，而是人该把精力放在哪、责任归谁。",
    "whyItMatters": "Agent 把大量执行性工作自动化后，组织若不调整阵型，会出现责任真空：出了问题不知道是 Agent 还是人负责，资深人员仍困在被自动化的细节里，价值最高的判断、评审和方向反而没人专注。这决定 AI 投入能否转化为组织能力。",
    "mentalModel": "把 AI 原生组织看成人机分工的重新编队：Agent 接管可自动化的执行，人上移到设定目标、定义验收、做高风险判断和兜底责任，而不是让人和 Agent 抢同一份活。",
    "mechanism": [
      "区分可自动化执行与必须由人负责的判断、评审和高风险决策。",
      "把人的角色上移到目标设定、验收标准、方向判断和异常兜底。",
      "明确每个 Agent 产出的责任归属，避免出事后的责任真空。",
      "用评测、可观测和价值复盘支撑组织级决策，而非个人感觉。",
      "随采纳率和能力变化持续调整人机分工，而不是一次定型。"
    ],
    "enterpriseCase": {
      "title": "责任真空与角色错配",
      "scenario": "某研发组织大规模引入 Agent，但沿用原有角色分工，覆盖约 800 名工程师。",
      "problem": "Agent 采纳率上去后，线上事故的责任归属不清，资深工程师仍在做被自动化的细节复核，约 30% 的人审是重复劳动。",
      "analysis": "组织只引入工具不调整阵型，没有重新定义人机责任边界，资深人力被困在低价值复核，高价值判断反而缺人。",
      "solution": "重画人机分工：Agent 接管可自动化执行，资深人员上移到验收、方向和高风险判断；明确每类产出的责任归属；用评测和复盘支撑决策。",
      "takeaway": "AI 原生组织的关键是重编人机分工和责任，而非简单减人。"
    },
    "pitfalls": [
      "只引入 Agent 工具却不调整组织阵型，导致责任真空和角色错配。",
      "让资深人员继续做被自动化的细节复核，高价值判断反而缺人。",
      "不明确 Agent 产出的责任归属，出事后无人负责。",
      "把 AI 转型简单等同于减人，忽视人机分工的重新设计。"
    ],
    "diagnosticQuestion": {
      "id": "q-ai-native-org-1",
      "type": "single",
      "scenario": "某组织大规模引入 Agent 但沿用原角色分工，结果事故责任归属不清，资深工程师仍在做被自动化的重复复核，高价值判断缺人。",
      "question": "最优先应该做什么？",
      "options": [
        {
          "id": "a",
          "text": "进一步提高 Agent 采纳率以替代更多人力"
        },
        {
          "id": "b",
          "text": "暂停 Agent 使用，回到引入前的分工"
        },
        {
          "id": "c",
          "text": "给资深工程师增加更多复核任务以保证质量"
        },
        {
          "id": "d",
          "text": "重新设计人机分工与责任归属，让人上移到验收、方向和高风险判断"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "D 是正解：问题是引入工具却没调整组织阵型。A 在阵型未理顺时扩大采纳会加重责任真空。B 回退放弃了已有价值。C 让资深人员继续做低价值复核，正是要纠正的错配。",
      "troubleshootingPath": [
        "区分可自动化执行与人负责的判断",
        "把人的角色上移到验收与方向",
        "明确每类产出的责任归属",
        "用评测与复盘支撑组织决策",
        "随能力变化持续调整分工"
      ],
      "relatedConceptIds": [
        "value-review-agent",
        "human-in-the-loop",
        "permission-governance",
        "eval",
        "multi-agent"
      ]
    },
    "keyTakeaways": [
      "AI 原生组织是重编人机分工，不是简单减人。",
      "人的角色应上移到验收、方向和高风险判断。",
      "每类 Agent 产出都要有明确责任归属。",
      "组织决策要靠评测和复盘，而非个人感觉。"
    ],
    "relatedConceptIds": [
      "value-review-agent",
      "human-in-the-loop",
      "permission-governance",
      "eval",
      "multi-agent"
    ]
  }
];

export const demoConcepts: KnowledgePoint[] = applyV2Revisions(rawDemoConcepts);
