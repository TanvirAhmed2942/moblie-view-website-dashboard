import { Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';

const Schedule = () => {
  // Auto-send state
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);
  const [autoSendSchedule, setAutoSendSchedule] = useState({
    frequency: 'weekly',
    day: 'friday',
    celebrationType: 'milestone_achievement',
    time: '14:00',
    timezone: 'UTC'
  });

  // Recipient management state
  const [recipientManagementEnabled, setRecipientManagementEnabled] = useState(true);
  const [recipientSettings, setRecipientSettings] = useState({
    campaignName: 'project-wellspring',
    organizationName: 'ripple-effect',
    recipientType: 'all_donors',
    minDonationAmount: '',
    includeInactive: false
  });

  // Handle auto-send schedule changes
  const handleAutoSendChange = (field: keyof typeof autoSendSchedule, value: string) => {
    setAutoSendSchedule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle recipient settings changes
  const handleRecipientChange = (field: keyof typeof recipientSettings, value: string | boolean) => {
    setRecipientSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save
  const handleSave = () => {
    const dataToSave = {
      autoSend: {
        enabled: autoSendEnabled,
        schedule: autoSendSchedule
      },
      recipients: {
        enabled: recipientManagementEnabled,
        settings: recipientSettings
      },
      savedAt: new Date().toISOString()
    };

    console.log('Saving schedule settings:', dataToSave);

    // Example API call
    // fetch('/api/schedule-settings', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dataToSave)
    // })

    alert('Schedule settings saved successfully!');
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Auto-Send Schedule */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900">Auto-Send Schedule</h3>
            <Switch
              checked={autoSendEnabled}
              onCheckedChange={setAutoSendEnabled}
            />
          </div>
          <p className="text-sm text-gray-600 mb-6">Define when to automatically send updates.</p>

          {autoSendEnabled && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Progress Updates</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Select
                    value={autoSendSchedule.frequency}
                    onValueChange={(value) => handleAutoSendChange('frequency', value)}
                  >
                    <SelectTrigger className="bg-purple-50 border-0 w-full">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>

                  {autoSendSchedule.frequency === 'weekly' && (
                    <Select
                      value={autoSendSchedule.day}
                      onValueChange={(value) => handleAutoSendChange('day', value)}
                    >
                      <SelectTrigger className="bg-purple-50 border-0 w-full">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={autoSendSchedule.time}
                      onChange={(e) => handleAutoSendChange('time', e.target.value)}
                      className="w-full px-3 py-2 bg-purple-50 border-0 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <Select
                      value={autoSendSchedule.timezone}
                      onValueChange={(value) => handleAutoSendChange('timezone', value)}
                    >
                      <SelectTrigger className="bg-purple-50 border-0 w-full">
                        <SelectValue placeholder="Timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">EST</SelectItem>
                        <SelectItem value="PST">PST</SelectItem>
                        <SelectItem value="CST">CST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>


            </>
          )}
        </div>

        {/* Recipient Management */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900">Recipient Management</h3>
            <Switch
              checked={recipientManagementEnabled}
              onCheckedChange={setRecipientManagementEnabled}
            />
          </div>
          <p className="text-sm text-gray-600 mb-6">Define target audiences for updates.</p>

          {recipientManagementEnabled && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select the Campaign Name</label>
                <Select
                  value={recipientSettings.campaignName}
                  onValueChange={(value) => handleRecipientChange('campaignName', value)}
                >
                  <SelectTrigger className="w-full bg-purple-50 border-0">
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project-wellspring">Project Wellspring</SelectItem>
                    <SelectItem value="spring-campaign">Spring Campaign</SelectItem>
                    <SelectItem value="winter-drive">Winter Drive</SelectItem>
                    <SelectItem value="summer-fundraiser">Summer Fundraiser</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select the Organization Name</label>
                <Select
                  value={recipientSettings.organizationName}
                  onValueChange={(value) => handleRecipientChange('organizationName', value)}
                >
                  <SelectTrigger className="w-full bg-purple-50 border-0">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ripple-effect">Ripple Effect Foundation</SelectItem>
                    <SelectItem value="charity-org">Charity Organization</SelectItem>
                    <SelectItem value="help-foundation">Help Foundation</SelectItem>
                    <SelectItem value="community-aid">Community Aid Society</SelectItem>
                  </SelectContent>
                </Select>
              </div>



            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;