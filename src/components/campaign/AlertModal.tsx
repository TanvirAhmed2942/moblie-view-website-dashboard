"use client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AlertTriangle, CalendarIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useSetAlertCampaignMutation } from '../../features/campaign/campaignApi';
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

// Define proper TypeScript interfaces
interface Campaign {
  _id: string;
  title: string;
  targetAmount?: number;
  overall_raised?: number;
  total_invitees?: number;
  campaignStatus?: string;
  startDate?: string;
  endDate?: string;
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: Campaign;
  campaignName?: string;
}

interface ExpireTime {
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeInput {
  hours: number;
  minutes: number;
}

function AlertModal({
  isOpen,
  onClose,
  campaign,
  campaignName = "Project Wellspring",
}: AlertModalProps) {
  const [donorCount, setDonorCount] = useState("231");
  const [inviteesNumber, setInviteesNumber] = useState("122");
  const [raisedAmount, setRaisedAmount] = useState("$2,12,312.39");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });
  const [startTime, setStartTime] = useState<TimeInput>({ hours: 0, minutes: 0 });
  const [endTime, setEndTime] = useState<TimeInput>({ hours: 0, minutes: 0 });
  const [setAlert, { isLoading }] = useSetAlertCampaignMutation();

  // Parse date string to Date object
  const parseDateString = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? undefined : date;
  };

  // Update state when props change
  useEffect(() => {
    if (isOpen && campaign) {
      // Set campaign data
      if (campaign.overall_raised !== undefined) {
        setDonorCount(campaign.overall_raised.toString());
      }
      if (campaign.total_invitees !== undefined) {
        setInviteesNumber(campaign.total_invitees.toString());
      }

      // Format raised amount
      if (campaign.overall_raised !== undefined) {
        setRaisedAmount(new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(campaign.overall_raised));
      }

      // Set dates from campaign
      if (campaign.startDate) {
        const parsedStartDate = parseDateString(campaign.startDate);
        if (parsedStartDate) {
          setStartDate(parsedStartDate);

          // Set end date from campaign or default to 30 days after start
          if (campaign.endDate) {
            const parsedEndDate = parseDateString(campaign.endDate);
            if (parsedEndDate) {
              setEndDate(parsedEndDate);
            } else {
              const defaultEnd = new Date(parsedStartDate);
              defaultEnd.setDate(defaultEnd.getDate() + 30);
              setEndDate(defaultEnd);
            }
          } else {
            const defaultEnd = new Date(parsedStartDate);
            defaultEnd.setDate(defaultEnd.getDate() + 30);
            setEndDate(defaultEnd);
          }
        }
      }

      // Set default alert message with campaign data
      if (campaign.title) {
        setAlertMessage(`Your "${campaign.title}" campaign is expiring in "{expire time}"`);
        setMessage(`Your "${campaign.title}" campaign is expiring. In Just "{hours}" Hours. You made a big difference. "{raised amount}" Raised!! "{invitees number}" Invitees "{donors number}" Donors`);
      }
    }
  }, [isOpen, campaign]);

  const [alertMessage, setAlertMessage] = useState(
    'Your Pass It Along Chain Is expiring in "{expire time}"'
  );
  const [message, setMessage] = useState(
    'Your Pass It Along Chain has expiring. In Just "{hours}" Hours. You made a big difference. "{raised amount}" Raised!! "{invitees number}" Invitees "{donors number}" Donors'
  );
  const [expireTime, setExpireTime] = useState<ExpireTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Combine date and time into a single Date object
  const combineDateAndTime = (
    date: Date | undefined,
    time: TimeInput
  ): Date | undefined => {
    if (!date) return undefined;
    const combined = new Date(date);
    combined.setHours(time.hours, time.minutes, 0, 0);
    return combined;
  };

  // Calculate expire time based on dates and times
  const calculateExpireTime = useCallback(() => {
    if (!startDate || !endDate) {
      setExpireTime({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    try {
      const startDateTime = combineDateAndTime(startDate, startTime);
      const endDateTime = combineDateAndTime(endDate, endTime);

      if (!startDateTime || !endDateTime) {
        setExpireTime({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const diffMs = endDateTime.getTime() - startDateTime.getTime();
      if (diffMs < 0) {
        setExpireTime({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setExpireTime({ hours, minutes, seconds });
    } catch {
      setExpireTime({ hours: 0, minutes: 0, seconds: 0 });
    }
  }, [startDate, endDate, startTime, endTime]);

  const handleCalculate = () => {
    calculateExpireTime();
  };

  // Calculate on mount and when dates change
  useEffect(() => {
    calculateExpireTime();
  }, [calculateExpireTime]);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Handle Send Alert
  const handleSendAlert = async () => {
    if (!campaign?._id) {
      toast.error("No campaign selected");
      return;
    }

    try {
      // Call the mutation
      const response = await setAlert({
        id: campaign._id,
        data: {
          alert: alertMessage,
          message: message,
          isSendAlert: true
        }
      }).unwrap();

      toast.success(response.message || "Alert sent successfully!");
      onClose();
    } catch (error: unknown) {
      console.error('Error sending alert:', error);
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? (error as { data?: { message?: string } }).data?.message
        : "Failed to send alert";
      toast.error(errorMessage || "Failed to send alert");
    }
  };

  // Extract countdown values for display
  const countdownHours = Math.floor(expireTime.hours % 24);
  const countdownMins = expireTime.minutes % 60;
  const countdownSecs = expireTime.seconds % 60;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="min-w-3xl max-w-6xl max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Send / Edit Campaign Alert
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-gray-600">
            Configure automated alerts for the &apos;{campaign?.title || campaignName}&apos;
            campaign.
          </DialogDescription>
        </div>

        <div className="space-y-6 mt-6">
          {/* Campaign Info Summary */}
          {campaign && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Campaign Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Target Amount</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(campaign.targetAmount || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Raised Amount</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(campaign.overall_raised || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Invitees</p>
                  <p className="font-semibold">{campaign.total_invitees || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold capitalize">{campaign.campaignStatus}</p>
                </div>
              </div>
            </div>
          )}

          {/* Alert Trigger Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Alert Trigger
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Set the conditions that will trigger this alert. The alert will
                be sent any of these conditions are met.
              </p>
            </div>

            <div className="w-full flex justify-between gap-10 ">
              {/* Left Panel - Date and Time Configuration */}
              <div className="flex flex-col gap-4 w-1/2">
                <div>
                  <Label className="text-gray-700 font-medium">
                    Start Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal border-gray-300",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "MMM dd, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">
                    Start Time
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <div className="flex-1">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={startTime.hours}
                        onChange={(e) =>
                          setStartTime({
                            ...startTime,
                            hours: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="HH"
                        className="border-gray-300"
                      />
                    </div>
                    <span className="self-center text-gray-500">:</span>
                    <div className="flex-1">
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={startTime.minutes}
                        onChange={(e) =>
                          setStartTime({
                            ...startTime,
                            minutes: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="MM"
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal border-gray-300",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "MMM dd, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => !!(startDate && date < startDate)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">End Time</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="flex-1">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={endTime.hours}
                        onChange={(e) =>
                          setEndTime({
                            ...endTime,
                            hours: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="HH"
                        className="border-gray-300"
                      />
                    </div>
                    <span className="self-center text-gray-500">:</span>
                    <div className="flex-1">
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={endTime.minutes}
                        onChange={(e) =>
                          setEndTime({
                            ...endTime,
                            minutes: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="MM"
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleCalculate}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Calculate Expire Time
                </Button>
              </div>

              {/* Expire Time Box */}
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 w-1/2">
                <h4 className="text-red-600 font-semibold mb-3 text-center">
                  Expire Time
                </h4>
                <div className="space-y-2 flex items-center justify-evenly">
                  <div className="flex flex-col items-center gap-2">
                    <Label className="text-sm text-gray-600">Hours</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatNumber(expireTime.hours)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Label className="text-sm text-gray-600">Minutes</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatNumber(expireTime.minutes)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Label className="text-sm text-gray-600">Seconds</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatNumber(expireTime.seconds)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Total: {expireTime.hours} hours, {expireTime.minutes} minutes, {expireTime.seconds} seconds
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customize Alert Message Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Customize Alert Message
            </h3>

            <div>
              <Label
                htmlFor="alertMessage"
                className="text-gray-700 font-medium"
              >
                Alert:
              </Label>
              <div className="relative mt-1">
                <Textarea
                  id="alertMessage"
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  maxLength={80}
                  className="min-h-[100px] border-gray-300 pr-16"
                  placeholder="Enter alert message (e.g., Your campaign is expiring in {expire time})"
                />
                <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {alertMessage.length}/80
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use {"{expire time}"} placeholder for countdown
              </p>
            </div>

            <div>
              <Label htmlFor="message" className="text-gray-700 font-medium">
                Message:
              </Label>
              <div className="relative mt-1">
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={150}
                  className="min-h-[100px] border-gray-300 pr-16"
                  placeholder="Enter detailed message with placeholders"
                />
                <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {message.length}/150
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Available placeholders: {"{hours}"}, {"{raised amount}"}, {"{invitees number}"}, {"{donors number}"}
              </p>
            </div>
          </div>

          {/* Alert Preview Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Alert Preview
            </h3>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 space-y-4">
              {/* Top Preview - Countdown Timer */}
              <div className="bg-white border border-yellow-300 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  {alertMessage.replace(/{expire time}/g, "").trim() ||
                    "Your campaign is expiring in"}
                </p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">
                      {countdownHours.toString().padStart(2, "0")}
                    </p>
                    <p className="text-xs text-gray-600">HOURS</p>
                  </div>
                  <span className="text-3xl font-bold text-red-600">:</span>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">
                      {countdownMins.toString().padStart(2, "0")}
                    </p>
                    <p className="text-xs text-gray-600">MINS</p>
                  </div>
                  <span className="text-3xl font-bold text-red-600">:</span>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">
                      {countdownSecs.toString().padStart(2, "0")}
                    </p>
                    <p className="text-xs text-gray-600">SECS</p>
                  </div>
                </div>
              </div>

              {/* Bottom Preview - Summary Message */}
              <div className="bg-white border border-yellow-300 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  {message
                    .replace(/{hours}/g, expireTime.hours.toString())
                    .replace(/{raised amount}/g, "")
                    .replace(/{invitees number}/g, "")
                    .replace(/{donors number}/g, "")
                    .split('"')[0] ||
                    "Your campaign is expiring. In Just"}
                  <span className="font-semibold"> {expireTime.hours}</span>{" "}
                  Hours
                  {message.split('"')[1]?.split('"')[0] ||
                    " You made a big difference."}
                </p>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-purple-600">
                    {raisedAmount} Raised!!
                  </p>
                  <p className="text-base text-gray-700">
                    {formatNumber(
                      parseInt(inviteesNumber.replace(/,/g, "")) || 0
                    )}{" "}
                    Invitees
                  </p>
                  <p className="text-base text-gray-700">
                    {formatNumber(parseInt(donorCount.replace(/,/g, "")) || 0)}{" "}
                    Donors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="flex-row gap-3 justify-end mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendAlert}
            disabled={isLoading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Alert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AlertModal;