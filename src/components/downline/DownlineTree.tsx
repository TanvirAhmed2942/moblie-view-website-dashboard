"use client"

import { useState } from "react"
import { Minus, Plus, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface DownlineChild {
  inviteId: string
  invitationUserName: string
  invitationUserPhone: string
  amount: number
  children: DownlineChild[]
}

interface DownlineRoot {
  userId: string
  name: string
  email: string | null
  phone: string
  amount: number
  children: DownlineChild[]
}

const DEPTH_COLORS = [
  "bg-purple-600 ring-purple-200",
  "bg-purple-500 ring-purple-200",
  "bg-purple-400 ring-purple-200",
  "bg-purple-500 ring-purple-200",
]

function formatAmount(n: number) {
  return `$${n.toLocaleString()}`
}

// ─── Node Bubble ──────────────────────────────────────────────────────────────

interface BubbleProps {
  initial: string
  name: string
  amount: number
  circleClass: string
  isRoot?: boolean
  hasChildren: boolean
  expanded: boolean
  onToggle: () => void
}

function NodeBubble({
  initial,
  name,
  amount,
  circleClass,
  isRoot,
  hasChildren,
  expanded,
  onToggle,
}: BubbleProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 select-none",
        hasChildren && "cursor-pointer"
      )}
      onClick={onToggle}
    >
      <div className="relative">
        <div
          className={cn(
            "flex items-center justify-center rounded-full font-bold text-white shadow-lg ring-4 transition-transform active:scale-95",
            isRoot ? "size-[72px] text-2xl" : "size-14 text-lg",
            circleClass
          )}
        >
          {initial}
        </div>

        {hasChildren && (
          <div
            className={cn(
              "absolute -bottom-1 -right-1 flex size-[18px] items-center justify-center rounded-full border-2 border-white shadow",
              expanded ? "bg-purple-800" : "bg-purple-400"
            )}
          >
            {expanded ? (
              <Minus className="size-2 text-white" />
            ) : (
              <Plus className="size-2 text-white" />
            )}
          </div>
        )}
      </div>

      <div className="max-w-[80px] text-center">
        <p
          className={cn(
            "font-semibold capitalize leading-tight truncate",
            isRoot ? "text-sm" : "text-xs"
          )}
        >
          {name}
        </p>
        <p className="text-[10px] font-semibold text-purple-600">
          {formatAmount(amount)}
        </p>
      </div>
    </div>
  )
}

// ─── SubTree: connectors + children ──────────────────────────────────────────

function SubTree({ nodes, depth }: { nodes: DownlineChild[]; depth: number }) {
  const isOnly = nodes.length === 1

  return (
    <div className="flex flex-col items-center">
      <div className="w-0.5 h-6 bg-purple-200" />

      <div className="flex items-start">
        {nodes.map((node, idx) => {
          const isFirst = idx === 0
          const isLast = idx === nodes.length - 1

          return (
            <div
              key={node.inviteId}
              className="relative flex flex-col items-center px-4"
            >
              {!isOnly && (
                <div
                  className="absolute top-0 h-0.5 bg-purple-200"
                  style={{
                    left: isFirst ? "50%" : "0",
                    right: isLast ? "50%" : "0",
                  }}
                />
              )}
              <div className="w-0.5 h-6 bg-purple-200" />
              <TreeNode node={node} depth={depth} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Recursive Tree Node ──────────────────────────────────────────────────────

function TreeNode({ node, depth = 0 }: { node: DownlineChild; depth?: number }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children.length > 0

  return (
    <div className="flex flex-col items-center">
      <NodeBubble
        initial={node.invitationUserName.charAt(0).toUpperCase()}
        name={node.invitationUserName}
        amount={node.amount}
        circleClass={DEPTH_COLORS[depth % DEPTH_COLORS.length]}
        hasChildren={hasChildren}
        expanded={expanded}
        onToggle={() => hasChildren && setExpanded((p) => !p)}
      />
      {hasChildren && expanded && (
        <SubTree nodes={node.children} depth={depth + 1} />
      )}
    </div>
  )
}

// ─── Public Export ────────────────────────────────────────────────────────────

export function DownlineTree({ data }: { data: DownlineRoot[] }) {
  const [expanded, setExpanded] = useState(true)

  if (!data || data.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-xl border bg-card py-20 text-muted-foreground shadow-sm">
        <Users className="mb-3 size-14 opacity-20" />
        <p className="text-sm font-medium">No downline data for this campaign.</p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl border bg-card shadow-sm">
      <div className="w-full overflow-x-auto">
        <div className="flex min-w-max w-full flex-col items-center py-10 px-10">
          {data.map((root) => (
            <div key={root.userId} className="flex flex-col items-center">
              <NodeBubble
                initial={root.name.charAt(0).toUpperCase()}
                name={root.name}
                amount={root.amount}
                circleClass="bg-purple-700 ring-purple-200"
                isRoot
                hasChildren={root.children.length > 0}
                expanded={expanded}
                onToggle={() => setExpanded((p) => !p)}
              />
              {root.children.length > 0 && expanded && (
                <SubTree nodes={root.children} depth={0} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
