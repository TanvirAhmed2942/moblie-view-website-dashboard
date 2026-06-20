"use client";

import { Combobox } from "@/components/ui/combobox";
import { useGetCampaignQuery } from "@/features/campaign/campaignApi";
import { useGetInvestQuery } from "@/features/invests/investsApi";
import { CustomLoading } from "@/hooks/CustomLoading";
import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InvestRecord {
  _id: string;
  userId: {
    _id: string;
    contact: string;
    image: string;
    name: string;
  };
  campaignId: { _id: string };
  phone: string;
  invitationUserPhone: string;
  invitationUserName: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function InvestDetailModal({
  record,
  onClose,
}: {
  record: InvestRecord | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!record} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-purple-700">Invitation Details</DialogTitle>
        </DialogHeader>

        {record && (
          <div className="space-y-4 pt-2">
            {/* Inviter avatar */}
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                {record.userId.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-base font-semibold capitalize text-gray-900">
                  {record.userId.name}
                </p>
                <p className="text-sm text-muted-foreground">{record.userId.contact}</p>
              </div>
            </div>

            <div className="divide-y rounded-lg border text-sm">
              <Row label="Record ID" value={`#${record._id.slice(-6).toUpperCase()}`} />
              <Row label="Inviter Phone" value={record.phone} />
              <Row label="Invited Name" value={record.invitationUserName} highlight />
              <Row label="Invited Phone" value={record.invitationUserPhone} />
              <Row
                label="Campaign ID"
                value={`#${record.campaignId._id.slice(-6).toUpperCase()}`}
              />
              <Row label="Invited At" value={formatDate(record.createdAt)} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          highlight ? "font-semibold text-purple-600" : "font-medium text-gray-800"
        }
      >
        {value}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InvestsTable() {
  const [campaignId, setCampaignId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewRecord, setViewRecord] = useState<InvestRecord | null>(null);

  // Campaign dropdown — auto-select first
  const { data: campaignData } = useGetCampaignQuery(undefined);
  useEffect(() => {
    const first = campaignData?.data?.result?.[0];
    if (first && !campaignId) setCampaignId(first._id);
  }, [campaignData]);

  const campaignOptions =
    campaignData?.data?.result?.map(
      (c: { _id: string; campaign_title: string }) => ({
        value: c._id,
        label: c.campaign_title,
      })
    ) ?? [];

  // Invests query — response: { data: { meta, result } }
  const {
    data: investsData,
    isLoading,
    isError,
    refetch,
  } = useGetInvestQuery(
    { page: currentPage, campaignId },
    { skip: !campaignId }
  );

  const result: InvestRecord[] = investsData?.data?.result ?? [];
  const meta: Meta = investsData?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

  // Client-side search
  const filtered = result.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.userId.name.toLowerCase().includes(q) ||
      r.invitationUserName.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.invitationUserPhone.includes(q)
    );
  });

  const totalPages = meta.totalPage;
  const showingStart = filtered.length > 0 ? (currentPage - 1) * meta.limit + 1 : 0;
  const showingEnd = Math.min(currentPage * meta.limit, meta.total);

  // Reset page when campaign changes
  useEffect(() => {
    setCurrentPage(1);
  }, [campaignId]);

  // ── Pagination buttons ──────────────────────────────────────────────────────
  function renderPageButtons() {
    const buttons: React.ReactNode[] = [];
    const btnClass = (active: boolean) =>
      `px-4 py-2 rounded-lg ${
        active
          ? "bg-purple-600 hover:bg-purple-700 text-white"
          : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
      }`;

    buttons.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "ghost"}
        className={btnClass(currentPage === 1)}
        onClick={() => setCurrentPage(1)}
      >
        1
      </Button>
    );

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2)
      buttons.push(<span key="e1" className="px-2 text-gray-700">...</span>);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "ghost"}
            className={btnClass(currentPage === i)}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </Button>
        );
      }
    }

    if (endPage < totalPages - 1)
      buttons.push(<span key="e2" className="px-2 text-gray-700">...</span>);

    if (totalPages > 1)
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "ghost"}
          className={btnClass(currentPage === totalPages)}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Button>
      );

    return buttons;
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (isLoading)
    return (
      <div className="flex h-[500px] items-center justify-center">
        <CustomLoading />
      </div>
    );

  if (isError)
    return (
      <div className="py-8 text-center">
        <p className="text-red-600">Failed to load data</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );

  return (
    <div className="space-y-4 rounded bg-white/80 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Invitation History</h1>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 border-gray-300 pl-10"
            />
          </div>

          {/* Campaign dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-purple-700">Campaign :</span>
            <Combobox
              options={campaignOptions}
              value={campaignId}
              onChange={setCampaignId}
              placeholder="Select a campaign"
              searchPlaceholder="Search campaign..."
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50 hover:bg-purple-50">
              <TableHead className="font-semibold text-gray-700">#</TableHead>
              <TableHead className="font-semibold text-gray-700">Inviter Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Inviter Phone</TableHead>
              <TableHead className="font-semibold text-gray-700">Invited Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Invited Phone</TableHead>
              <TableHead className="font-semibold text-gray-700">Date</TableHead>
              <TableHead className="font-semibold text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                  {!campaignId ? "Select a campaign to see data" : "No records found"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((record, idx) => (
                <TableRow key={record._id} className="bg-white hover:bg-gray-50">
                  <TableCell className="text-sm text-muted-foreground">
                    {(currentPage - 1) * meta.limit + idx + 1}
                  </TableCell>
                  <TableCell className="font-medium capitalize">
                    {record.userId.name}
                  </TableCell>
                  <TableCell>{record.phone}</TableCell>
                  <TableCell className="font-medium capitalize">
                    {record.invitationUserName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.invitationUserPhone}
                  </TableCell>
                  <TableCell>{formatDate(record.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                      onClick={() => setViewRecord(record)}
                    >
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {showingStart} to {showingEnd} of {meta.total} records
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded-lg border-gray-300 px-4 py-2 text-gray-700 disabled:opacity-50"
            >
              &lt; Previous
            </Button>
            <div className="flex items-center gap-2">{renderPageButtons()}</div>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              Next &gt;
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <InvestDetailModal record={viewRecord} onClose={() => setViewRecord(null)} />
    </div>
  );
}
