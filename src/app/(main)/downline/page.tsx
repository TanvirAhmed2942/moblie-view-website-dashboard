"use client"

import { useEffect, useState } from "react"
import { Combobox } from "@/components/ui/combobox"
import { DownlineTree } from "@/components/downline/DownlineTree"
import { useGetCampaignQuery } from "@/features/campaign/campaignApi"
import { useGetDownlineQuery } from "@/features/downline/downlineApi"

export default function Page() {
  const [campaignId, setCampaignId] = useState("")

  const { data: campaignData } = useGetCampaignQuery(undefined)

  useEffect(() => {
    const first = campaignData?.data?.result?.[0]
    if (first && !campaignId) {
      setCampaignId(first._id)
    }
  }, [campaignData])

  const { data: downlineData } = useGetDownlineQuery(campaignId, {
    skip: !campaignId,
  })

  const campaignOptions =
    campaignData?.data?.result?.map((c: { _id: string; campaign_title: string }) => ({
      value: c._id,
      label: c.campaign_title,
    })) ?? []

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Downline</h1>
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

      <DownlineTree data={downlineData?.data ?? []} />
    </div>
  )
}
