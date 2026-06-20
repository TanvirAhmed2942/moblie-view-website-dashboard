"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, Minus, Plus, Users } from "lucide-react"
import { useState } from "react"

interface DownlineChild {
  inviteId: string
  invitationUserName: string
  invitationUserPhone: string
  amount: number
  children: DownlineChild[]
};

interface DownlineRoot {
  userId: string
  name: string
  email: string | null
  phone: string
  amount: number
  children: DownlineChild[]
}


function fmt(n: number) {
  return `$${n.toLocaleString()}`
}

const DEPTH_BG = ["bg-purple-600", "bg-purple-500", "bg-purple-400", "bg-purple-500"]

const UNIT = 110;

function leafCount(node: DownlineChild): number {
  if (node.children.length === 0) return 1
  return node.children.reduce((s, c) => s + leafCount(c), 0)
};

function RootCard({
  root,
  selected,
  onClick,
}: {
  root: DownlineRoot
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-2 rounded-2xl border px-5 py-5 transition-all duration-200 min-w-[120px]",
        selected
          ? "border-purple-400 bg-white shadow-md"
          : "border-gray-200 bg-white shadow-sm hover:border-purple-300 hover:shadow-md"
      )}
    >
      {/* Selected: left accent bar */}
      {selected && (
        <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-purple-600" />
      )}

      {/* Avatar */}
      <div className="relative">
        <div
          className={cn(
            "flex size-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-md ring-4 transition-all duration-200",
            selected
              ? "bg-purple-700 ring-purple-300"
              : "bg-purple-600 ring-purple-100 group-hover:bg-purple-700 group-hover:ring-purple-200"
          )}
        >
          {root.name.charAt(0).toUpperCase()}
        </div>
        {root.children.length > 0 && (
          <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white ring-2 ring-white">
            {root.children.length}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="text-center">
        <p className="text-sm font-semibold capitalize text-gray-800 leading-tight">{root.name}</p>
        <p className="text-xs font-semibold text-purple-600 mt-0.5">{fmt(root.amount)}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {root.children.length} referral{root.children.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Expand indicator */}
      <div
        className={cn(
          "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
          selected
            ? "bg-purple-100 text-purple-700"
            : "bg-gray-100 text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-500"
        )}
      >
        <ChevronDown
          className={cn("size-3 transition-transform duration-200", selected && "rotate-180")}
        />
        {selected ? "Hide" : "View"}
      </div>
    </button>
  )
}

// ─── Node Bubble ──────────────────────────────────────────────────────────────

function NodeBubble({
  letter,
  name,
  amount,
  bg,
  size = "md",
  hasChildren,
  expanded,
  onToggle,
}: {
  letter: string
  name: string
  amount: number
  bg: string
  size?: "lg" | "md"
  hasChildren: boolean
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      className={cn("flex flex-col items-center gap-2 select-none", hasChildren && "cursor-pointer")}
    >
      <div className="relative">
        <div
          className={cn(
            "flex items-center justify-center rounded-full font-bold text-white shadow-lg ring-4 ring-purple-200 transition-transform active:scale-95",
            bg,
            size === "lg" ? "size-[72px] text-2xl" : "size-14 text-lg"
          )}
        >
          {letter}
        </div>
        {hasChildren && (
          <div
            className={cn(
              "absolute -bottom-1 -right-1 flex size-[18px] items-center justify-center rounded-full border-2 border-white shadow",
              expanded ? "bg-purple-800" : "bg-purple-400"
            )}
          >
            {expanded ? <Minus className="size-2 text-white" /> : <Plus className="size-2 text-white" />}
          </div>
        )}
      </div>
      <div className="max-w-[90px] text-center">
        <p className={cn("font-semibold capitalize leading-tight truncate", size === "lg" ? "text-sm" : "text-xs")}>
          {name}
        </p>
        <p className="text-[10px] font-semibold text-purple-600">{fmt(amount)}</p>
      </div>
    </div>
  )
}


function SubTree({ nodes, depth }: { nodes: DownlineChild[]; depth: number }) {
  const single = nodes.length === 1
  const leaves = nodes.map(leafCount)

  const outerLeaves = single ? leaves[0] : Math.max(leaves[0], leaves[leaves.length - 1])

  const widths = leaves.map((l, i) => {
    if (!single && (i === 0 || i === nodes.length - 1)) {
      return Math.max(l, outerLeaves) * UNIT
    }
    return l * UNIT
  })

  return (
    <div className="flex flex-col items-center">
      <div className="h-8 w-0.5 bg-purple-200" />
      <div className="flex items-start">
        {nodes.map((node, idx) => (
          <div
            key={node.inviteId}
            className="relative flex flex-col items-center"
            style={{ width: widths[idx] }}
          >
            {/* Horizontal connector segment */}
            {!single && (
              <div
                className="absolute top-0 h-0.5 bg-purple-200"
                style={{
                  left: idx === 0 ? "50%" : 0,
                  right: idx === nodes.length - 1 ? "50%" : 0,
                }}
              />
            )}

            {/* Vertical line from connector down to circle */}
            <div className="h-8 w-0.5 bg-purple-200" />

            <TreeNode node={node} depth={depth} />
          </div>
        ))}
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
        letter={node.invitationUserName.charAt(0).toUpperCase()}
        name={node.invitationUserName}
        amount={node.amount}
        bg={DEPTH_BG[depth % DEPTH_BG.length]}
        hasChildren={hasChildren}
        expanded={expanded}
        onToggle={() => hasChildren && setExpanded((p) => !p)}
      />
      {hasChildren && expanded && <SubTree nodes={node.children} depth={depth + 1} />}
    </div>
  )
}

// ─── Public Export ────────────────────────────────────────────────────────────

export function DownlineTree({ data }: { data: DownlineRoot[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-xl border bg-card py-20 text-muted-foreground shadow-sm">
        <Users className="mb-3 size-14 opacity-20" />
        <p className="text-sm font-medium">No downline data for this campaign.</p>
      </div>
    )
  }

  const selectedRoot = data.find((r) => r.userId === selectedId)

  const toggle = (id: string) =>
    setSelectedId((prev) => (prev === id ? null : id))

  return (
    <div className="w-full rounded-xl border bg-card shadow-sm">
      {/* ── Carousel (always visible) ─────────────────────────────────────── */}
      <div className="p-6">
        <p className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4 text-purple-500" />
          {data.length} parent{data.length !== 1 ? "s" : ""} — tap to view tree
        </p>
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-4 w-max">
            {data.map((root) => (
              <RootCard
                key={root.userId}
                root={root}
                selected={selectedId === root.userId}
                onClick={() => toggle(root.userId)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Tree expands below when a parent is selected ───────────────────── */}
      {selectedRoot && (
        <>
          <div className="border-t border-purple-100" />
          <div className="w-full overflow-x-auto">
            <div className="flex w-full min-w-max flex-col items-center py-10 px-10">
              <NodeBubble
                letter={selectedRoot.name.charAt(0).toUpperCase()}
                name={selectedRoot.name}
                amount={selectedRoot.amount}
                bg="bg-purple-700"
                size="lg"
                hasChildren={false}
                expanded={true}
                onToggle={() => { }}
              />
              {selectedRoot.children.length > 0 && (
                <SubTree nodes={selectedRoot.children} depth={0} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
