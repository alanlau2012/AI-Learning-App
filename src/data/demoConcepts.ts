import type { KnowledgePoint } from '../types';

/**
 * MVP 样板与扩展内容。
 * 来源：content/drafts/*.json，经 reviews/content-review-12-lessons-round-02.md 复核通过后由主开发入库。
 */
export const demoConcepts: KnowledgePoint[] = [
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
    "definition": "Session 亲和是让同一会话的连续请求尽量路由到持有相关上下文和 KV Cache 的实例，以提升缓存命中和上下文连续性。",
    "whyItMatters": "Session 亲和不是“粘住用户”这么简单，而是为了让多轮对话、Agent 任务和长上下文链路保持性能与状态连续。亲和失效时，用户看到的是首字忽快忽慢、上下文像丢了、限流策略不一致、同一任务重复计算。平台侧要看 KV Cache 命中率、会话迁移率、实例热点、P99 TTFT、故障切换成功率和亲和过期策略。",
    "mentalModel": "会话像一份正在办理的案卷。每次都回到同一个柜台，柜台有之前读过的材料和处理记录；如果每轮都随机换柜台，就会反复翻案卷，甚至丢掉一些临时状态。但永远只找一个柜台也会造成排队和单点风险。",
    "mechanism": [
      "首轮请求经过 Prefill 后，会在实例上形成 KV Cache 和会话相关状态。",
      "后续请求如果路由到同一实例或同一缓存域，可复用前缀缓存，降低重复 Prefill。",
      "如果请求被打散到不同实例，缓存未命中会导致 TTFT 上升，并可能触发重复上下文处理。",
      "亲和策略需要与负载均衡、扩缩容、限流、故障转移和租户隔离一起设计。",
      "过度亲和会造成热点实例、负载不均和容灾困难，因此要设置 TTL、迁移条件和降级路径。"
    ],
    "animation": {
      "type": "kv-cache",
      "title": "Session 亲和命中与打散重算",
      "steps": [
        { "id": "s1", "title": "同一会话进入实例", "description": "多轮请求携带 session id，路由层尝试让它回到持有上下文的实例。", "highlightTargets": ["session", "instance"] },
        { "id": "s2", "title": "首轮写入 KV Cache", "description": "首轮 Prefill 后，实例保存已读上下文的 K/V 笔记。", "highlightTargets": ["prefill", "kv-write"] },
        { "id": "s3", "title": "亲和命中复用缓存", "description": "后续请求命中同一缓存域，Decode 可以复用已有 KV，TTFT 更低。", "highlightTargets": ["cache-hit", "decode"] },
        { "id": "s4", "title": "路由打散导致未命中", "description": "扩容或负载均衡把请求打到空缓存实例，需要重新 Prefill。", "highlightTargets": ["route-miss", "cache-miss"] },
        { "id": "s5", "title": "过度亲和带来热点", "description": "长会话和热门租户会挤占显存，亲和策略还要处理容量、淘汰和容灾。", "highlightTargets": ["memory", "eviction"] }
      ]
    },
    "enterpriseCase": {
      "title": "多轮客服会话高峰期首字抖动",
      "scenario": "某 MaaS 平台承载 60 个业务应用，客服助手单日约 35 万轮对话，高峰期自动扩容。",
      "problem": "用户反馈同一会话前几轮很快，后几轮首字突然从 900ms 升到 4.5s；监控显示会话迁移率从 8% 升到 37%，KV 命中率下降到 22%。",
      "analysis": "扩容后负载均衡只按实例空闲度分配，没有保持会话亲和；部分限流状态也跟着实例变化，导致体验不稳定。",
      "solution": "引入基于 session id 的一致性路由和缓存域，设置热点迁移阈值与亲和 TTL；扩容时预热热门会话并监控迁移率。",
      "takeaway": "Session 亲和提升缓存命中，但必须和热点、容灾、限流一起治理。"
    },
    "pitfalls": [
      "把 Session 亲和理解成用户粘性，而不是缓存和状态连续性。",
      "只追求亲和命中率，忽略热点实例和负载不均。",
      "扩缩容时不迁移或预热缓存，导致高峰期大量重算。",
      "会话状态、限流和缓存策略分别设计，出了问题难以复盘。"
    ],
    "diagnosticQuestion": {
      "id": "q-session-affinity-1",
      "type": "single",
      "scenario": "MaaS 平台扩容后，同一客服会话的 TTFT 波动明显。KV 命中率下降，会话迁移率上升，但 GPU 利用率并未持续打满。",
      "question": "最应该优先排查哪项？",
      "options": [
        { "id": "a", "text": "是否需要把所有请求固定到最空闲的实例" },
        { "id": "b", "text": "扩容后的 session 路由是否打散了持有 KV Cache 的会话" },
        { "id": "c", "text": "是否应该提高输出 token 上限，让回答更完整" },
        { "id": "d", "text": "是否需要把 temperature 降到 0" }
      ],
      "correctOptionIds": ["b"],
      "explanation": "B 直接对应会话迁移率上升和 KV 命中下降。A 是强干扰项，按空闲实例分配看似均衡，但会破坏会话缓存。C 影响输出长度和 TPOT，不解决首字抖动。D 影响随机性，不解释缓存命中下降。",
      "troubleshootingPath": ["按 session id 追踪连续请求落到哪些实例", "对比命中与未命中的 TTFT、Prefill 时长和缓存状态", "检查扩缩容、故障转移和负载均衡策略是否绕过亲和", "识别热点会话与实例负载不均", "设置亲和 TTL、迁移条件、缓存预热和故障降级"],
      "relatedConceptIds": ["kv-cache", "prefill", "ttft", "model-gateway", "rate-limit-circuit-break", "sla"]
    },
    "keyTakeaways": [
      "Session 亲和的核心价值是 KV Cache 命中和上下文连续。",
      "请求打散会带来重复 Prefill、TTFT 抖动和状态不一致。",
      "亲和策略必须平衡缓存收益、热点风险和容灾能力。",
      "平台要把会话迁移率与缓存命中率作为一组指标看。"
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
    }
];