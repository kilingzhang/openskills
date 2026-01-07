# PR Summary: Customizable Template System for AGENTS.md

## 问题描述 (Problem Statement)

用户希望可以：
1. 指定AGENTS.md的输出路径和文件名（比如输出到 `.xxxx/rules/AGENTS.mdc`）
2. 按照自定义模版生成内容，以适应各种不同的 coding agent（Cursor, Windsurf, Aider等）

## 解决方案 (Solution)

实现了一个完整的模版系统，包括：

### 1. 灵活的输出路径
- 移除了 `.md` 扩展名限制
- 支持任意扩展名：`.md`, `.mdc`, `.txt` 等
- 自动创建嵌套目录

### 2. 模版系统
- 支持自定义模版文件
- 变量替换：`{{SKILLS}}`, `{{PRIORITY}}`, `{{USAGE_INSTRUCTIONS}}`, `{{COMMAND}}`
- 默认模版保持向后兼容

### 3. 配置文件
- 支持 `.openskillsrc.json` 或 `.openskillsrc`
- 可配置：output路径、template路径、priority级别
- CLI参数优先级高于配置文件

## 使用示例 (Usage Examples)

### 基本用法 (保持不变)
```bash
openskills sync
```

### 自定义输出路径
```bash
# 输出到自定义路径，支持 .mdc 扩展
openskills sync --output .github/rules/AGENTS.mdc
```

### 使用自定义模版
```bash
# 为 Cursor 使用专门的模版
openskills sync --template examples/templates/cursor-template.md

# 为 Windsurf 使用专门的模版
openskills sync --template examples/templates/windsurf-template.md
```

### 使用配置文件
创建 `.openskillsrc.json`:
```json
{
  "output": ".github/rules/AGENTS.mdc",
  "template": "templates/custom-template.md",
  "priority": 1
}
```

然后直接运行：
```bash
openskills sync
```

## 模版变量 (Template Variables)

- `{{SKILLS}}` - 技能的 XML 标签
- `{{PRIORITY}}` - 优先级（默认：1）
- `{{USAGE_INSTRUCTIONS}}` - 使用说明
- `{{COMMAND}}` - 调用技能的命令（默认："openskills read"）

## 示例模版 (Example Templates)

项目包含了多个不同 agent 的模版示例：

1. **Cursor AI** (`examples/templates/cursor-template.md`)
```markdown
# Cursor AI Configuration

<ai_rules priority="{{PRIORITY}}">
...
{{SKILLS}}
...
</ai_rules>
```

2. **Windsurf** (`examples/templates/windsurf-template.md`)
```markdown
# Windsurf Agent Setup

Priority: {{PRIORITY}}
...
{{SKILLS}}
...
```

3. **Aider** (`examples/templates/aider-template.md`)
```markdown
# Aider Skills Configuration
...
{{SKILLS}}
...
```

## 技术细节 (Technical Details)

### 新增文件
- `src/utils/template.ts` - 模版渲染引擎
- `src/utils/config.ts` - 配置文件加载
- `tests/utils/template.test.ts` - 模版测试
- `tests/utils/config.test.ts` - 配置测试
- `examples/TEMPLATES.md` - 完整文档
- `examples/templates/` - 示例模版

### 修改文件
- `src/commands/sync.ts` - 集成模版和配置支持
- `src/utils/agents-md.ts` - 重构为使用模版系统
- `src/cli.ts` - 添加 `--template` 参数
- `src/types.ts` - 新增接口定义

### 测试
- **111个测试全部通过** ✅
- 新增23个测试
- 100%向后兼容
- 手动测试确认所有功能正常

### 性能优化
- 使用单次正则替换而非多次字符串拆分
- 高效处理大型模版

## 向后兼容性 (Backward Compatibility)

✅ **完全向后兼容**
- 默认行为不变（创建 AGENTS.md 使用原格式）
- 所有现有命令正常工作
- 无破坏性变更

## 文档 (Documentation)

- `examples/TEMPLATES.md` - 详细使用指南
- `examples/demo.sh` - 可执行演示脚本
- `IMPLEMENTATION.md` - 技术实现细节
- `README.md` - 更新了自定义部分

## 演示 (Demo)

运行 `bash examples/demo.sh` 可以看到所有功能的演示，包括：
1. 默认输出
2. 自定义路径（.mdc扩展）
3. 使用自定义模版
4. 使用配置文件

## 总结 (Summary)

这个PR完整实现了用户需求：
- ✅ 支持自定义输出路径和文件名
- ✅ 支持自定义模版以适配不同的 coding agent
- ✅ 提供了完整的文档和示例
- ✅ 保持100%向后兼容
- ✅ 所有测试通过
- ✅ 代码质量经过审查和优化
