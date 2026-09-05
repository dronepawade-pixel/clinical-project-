import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth/rbac";
import { createSupabaseServer } from "@/lib/supabase/server";
import { markReadAction, markAllReadAction } from "./actions";

const TYPE_LABELS: Record<string, string> = {
  SAE_REPORT: "Serious adverse event",
  DEFAULT: "Notification",
};

export default async function NotificationsPage() {
  const profile = await requireUser();
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(50);
  const notifications = data ?? [];
  const unread = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">{unread} unread.</p>
        </div>
        {unread > 0 && (
          <form action={markAllReadAction}>
            <Button variant="outline" size="sm" type="submit">
              Mark all read
            </Button>
          </form>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inbox</CardTitle>
          <CardDescription>Most recent first.</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No notifications yet. SAE reports and approvals will appear here.
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-lg border p-3 text-sm ${
                    n.read_at ? "" : "border-primary/40 bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={n.type === "SAE_REPORT" ? "destructive" : "secondary"}>
                        {TYPE_LABELS[n.type] ?? TYPE_LABELS.DEFAULT}
                      </Badge>
                      {!n.read_at && <Badge>New</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {n.type === "SAE_REPORT"
                      ? `Severity: ${String(n.payload?.severity ?? "—")} · Deadline: ${n.payload?.deadline_hours} hours · AE ${String(n.payload?.ae_id ?? "").slice(0, 8)}…`
                      : JSON.stringify(n.payload)}
                  </p>
                  {!n.read_at && (
                    <form action={markReadAction}>
                      <input type="hidden" name="id" value={n.id} />
                      <Button variant="ghost" size="sm" className="mt-1" type="submit">
                        Mark read
                      </Button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
