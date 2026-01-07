#!/bin/bash
# Demo script showing template system features

echo "================================"
echo "OpenSkills Template System Demo"
echo "================================"
echo

# Create a test skill
echo "1. Creating demo skill..."
mkdir -p .claude/skills/demo-skill
cat > .claude/skills/demo-skill/SKILL.md << 'EOF'
---
name: demo-skill
description: Demo skill showcasing the template system
---

# Demo Skill

This skill demonstrates the new template functionality.
EOF

echo "   ✅ Demo skill created"
echo

# Test 1: Default output
echo "2. Testing default sync (AGENTS.md)..."
node dist/cli.js sync -y
echo

# Test 2: Custom output path with .mdc extension
echo "3. Testing custom output path (.mdc extension)..."
node dist/cli.js sync -y --output .github/AGENTS.mdc
echo "   Generated: .github/AGENTS.mdc"
echo

# Test 3: Using custom template
echo "4. Testing custom template..."
node dist/cli.js sync -y --output .cursor/rules.md --template examples/templates/cursor-template.md
echo "   Generated: .cursor/rules.md with Cursor template"
echo

# Test 4: Using config file
echo "5. Testing config file..."
cat > .openskillsrc.json << 'EOF'
{
  "output": ".windsurf/AGENTS.md",
  "template": "examples/templates/windsurf-template.md"
}
EOF

node dist/cli.js sync -y
echo "   Generated: .windsurf/AGENTS.md using config file"
echo

# Show results
echo "================================"
echo "Generated Files:"
echo "================================"
echo
echo "AGENTS.md (default):"
head -5 AGENTS.md
echo "..."
echo
echo ".github/AGENTS.mdc:"
head -5 .github/AGENTS.mdc
echo "..."
echo
echo ".cursor/rules.md (Cursor template):"
head -5 .cursor/rules.md
echo "..."
echo
echo ".windsurf/AGENTS.md (Windsurf template):"
head -5 .windsurf/AGENTS.md
echo "..."
echo

# Cleanup
echo "================================"
echo "Cleanup"
echo "================================"
rm -rf .claude .github/AGENTS.mdc .cursor .windsurf AGENTS.md .openskillsrc.json
echo "✅ Demo complete! Cleaned up test files."
