'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const NotificationsAndUpdates = () => {
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);
  const [recipientManagementEnabled, setRecipientManagementEnabled] = useState(true);
  const [notifications, setNotifications] = useState({
    campaignExpired: { email: true, inApp: false },
    lowProgress: { email: true, inApp: true },
    newDonor: { email: false, inApp: true }
  });

  return (
    <div className="space-y-6 p-6">
      {/* Update Sending Configuration */}
      <Card className="border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Sending Configuration</h2>
          <p className="text-sm text-gray-600 mb-6">Create and manage templates for progress updates and celebration emails.</p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="weekly-update">Weekly Progress Update</Label>
              <Textarea
                id="weekly-update"
                placeholder="Hi '{donor_name}', type weekly update message here..."
                className="mt-2 bg-purple-50 border-0"
              />
              <div className="text-right text-xs text-gray-500 mt-1">0/280</div>
            </div>

            <div>
              <Label htmlFor="milestone-celebration">Milestone Celebration</Label>
              <Textarea
                id="milestone-celebration"
                placeholder="Congratulations! We've reached the '{milestone_name}' milestone for the '{campaign_name}' campaign!"
                className="mt-2 bg-purple-50 border-0"
              />
              <div className="text-right text-xs text-gray-500 mt-1">0/280</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Auto-Send Schedule and Recipient Management */}
      <div className="grid grid-cols-2 gap-6">
        {/* Auto-Send Schedule */}
        <Card className="border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900">Auto-Send Schedule</h3>
              <Switch
                checked={autoSendEnabled}
                onCheckedChange={setAutoSendEnabled}
              />
            </div>
            <p className="text-sm text-gray-600 mb-6">Define when to automatically send updates.</p>

            <div className="mb-6">
              <Label>Progress Updates</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Select>
                  <SelectTrigger className="bg-purple-50 border-0">
                    <SelectValue placeholder="Weekly" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="bg-purple-50 border-0">
                    <SelectValue placeholder="Friday" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Celebration Messages</Label>
              <RadioGroup defaultValue="achievement" className="mt-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="achievement" id="achievement" />
                  <Label htmlFor="achievement" className="text-sm font-normal">
                    Send upon milestone achievement
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </Card>

        {/* Recipient Management */}
        <Card className="border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900">Recipient Management</h3>
              <Switch
                checked={recipientManagementEnabled}
                onCheckedChange={setRecipientManagementEnabled}
              />
            </div>
            <p className="text-sm text-gray-600 mb-6">Define target audiences for updates.</p>

            <div className="mb-4">
              <Label htmlFor="campaign-select">Select the Campaign Name</Label>
              <Select>
                <SelectTrigger id="campaign-select" className="mt-2 bg-purple-50 border-0">
                  <SelectValue placeholder="Project Wellspring" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wellspring">Project Wellspring</SelectItem>
                  <SelectItem value="other">Other Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="org-select">Select the Organization Name</Label>
              <Select>
                <SelectTrigger id="org-select" className="mt-2 bg-purple-50 border-0">
                  <SelectValue placeholder="Ripple Effect Foundation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ripple">Ripple Effect Foundation</SelectItem>
                  <SelectItem value="other">Other Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* System Notifications */}
      <Card className="border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">System Notifications</h3>
          <p className="text-sm text-gray-600 mb-6">Configure internal and external notifications for important system events.</p>

          <div className="space-y-6">
            {/* Campaign Expired Alert */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Campaign Expired Alert</h4>
                <p className="text-sm text-gray-600 mt-1">Notify when a campaign reaches it's end date.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notifications.campaignExpired.email}
                    onCheckedChange={(checked) => setNotifications({
                      ...notifications,
                      campaignExpired: { ...notifications.campaignExpired, email: checked }
                    })}
                  />
                  <Label className="text-sm">Email</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notifications.campaignExpired.inApp}
                    onCheckedChange={(checked) => setNotifications({
                      ...notifications,
                      campaignExpired: { ...notifications.campaignExpired, inApp: checked }
                    })}
                  />
                  <Label className="text-sm">In-App</Label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Low Progress Warning */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Low Progress Warning</h4>
                <p className="text-sm text-gray-600 mt-1">Alert when campaign is below 25% with 1 week left.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notifications.lowProgress.email}
                    onCheckedChange={(checked) => setNotifications({
                      ...notifications,
                      lowProgress: { ...notifications.lowProgress, email: checked }
                    })}
                  />
                  <Label className="text-sm">Email</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notifications.lowProgress.inApp}
                    onCheckedChange={(checked) => setNotifications({
                      ...notifications,
                      lowProgress: { ...notifications.lowProgress, inApp: checked }
                    })}
                  />
                  <Label className="text-sm">In-App</Label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* New Donor Notification */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">New Donor Notification</h4>
                <p className="text-sm text-gray-600 mt-1">Notify when a new donor contributes to a campaign.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notifications.newDonor.email}
                    onCheckedChange={(checked) => setNotifications({
                      ...notifications,
                      newDonor: { ...notifications.newDonor, email: checked }
                    })}
                  />
                  <Label className="text-sm">Email</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notifications.newDonor.inApp}
                    onCheckedChange={(checked) => setNotifications({
                      ...notifications,
                      newDonor: { ...notifications.newDonor, inApp: checked }
                    })}
                  />
                  <Label className="text-sm">In-App</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-purple-600 hover:bg-purple-700">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default NotificationsAndUpdates;