import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface SurveySettingsProps {
  allowLiveResults: boolean;
  startDate?: Date;
  endDate?: Date;
  onAllowLiveResultsChange: (value: boolean) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export function SurveySettings({
  allowLiveResults,
  startDate,
  endDate,
  onAllowLiveResultsChange,
  onStartDateChange,
  onEndDateChange,
}: SurveySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Survey Settings</CardTitle>
        <CardDescription>
          Configure how your survey behaves
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Live Results Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="live-results">Allow Live Results</Label>
            <p className="text-sm text-muted-foreground">
              Let participants view results in real-time after submitting
            </p>
          </div>
          <Switch
            id="live-results"
            checked={allowLiveResults}
            onCheckedChange={onAllowLiveResultsChange}
          />
        </div>

        {/* Scheduling */}
        <div className="space-y-4">
          <Label>Schedule (optional)</Label>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Start Date</Label>
              <div className="flex gap-2 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={onStartDateChange}
                    />
                  </PopoverContent>
                </Popover>
                {startDate && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStartDateChange(undefined)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">End Date</Label>
              <div className="flex gap-2 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={onEndDateChange}
                      disabled={(date) =>
                        startDate ? date < startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
                {endDate && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEndDateChange(undefined)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Leave blank to make the survey available immediately and indefinitely
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
