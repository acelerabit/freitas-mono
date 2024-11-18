import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UpgradeCard() {
  return (
    <div className="mt-auto p-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Upgrade to Pro</CardTitle>
          <CardDescription>
            Unlock all features and get unlimited access to our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="sm">
            Upgrade
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
