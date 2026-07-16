---
title: Copilot Local Multi-Agent Guide
version: 0.1
---

# 目的
各開発者がローカルで中央集権型マルチエージェント運用を再現する手順。

# 使い方（毎回これだけ）
1. Copilot Chatで「Orchestrator」として開始
2. Planner → Architect（必要時）→ Coder → Tester → Reviewer → Security の順に進める
3. HITLが出たら、人間が判断してから続行

# 推奨プロンプト例
- 「.github/agents/00_orchestrator.md のルールで進めて。まずPlannerとして計画を出して」
- 「次はCoder。差分最小で実装し、ローカル検証コマンドを提示して」
- 「Reviewerとして4層レビューして」

# ローカル確認チェックリスト
- [ ] lint
- [ ] test
- [ ] build
- [ ] typecheck（ある場合）
- [ ] 主要フローの手動確認（必要時）

# HITL（承認が必要な例）
- データ削除/大量更新、権限変更、外部送信、本番設定、Secrets操作

# FAQ
- 「コマンドが分からない」→ package.json / README / Makefile / scripts を探し、無ければ質問する
- 「テストが無い」→ 代替検証（手動確認・ログ確認）を明記する

# 期待する結果
- 誰がやっても同じ手順で進み、レビュー観点も揃う
- 危険操作は必ず人間が止められる
