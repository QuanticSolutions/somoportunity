import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderPayment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sub, setSub] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    const { data } = await supabase
      .from("provider_subscriptions")
      .select("*, subscription_plans(*)")
      .eq("provider_id", user!.id)
      .single();

    if (!data) {
      navigate("/provider/subscribe", { replace: true });
      return;
    }

    if (data.status === "active") {
      navigate("/dashboard/provider", { replace: true });
      return;
    }

    if (data.receipt_url || data.status === "under_review") {
      navigate("/provider/pending", { replace: true });
      return;
    }

    setSub(data);
    setPlan(data.subscription_plans);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !sub) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 10MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/receipt_${Date.now()}.${ext}`;

      console.log("[Receipt] Uploading file to storage:", path);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("payment_receipts")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        console.error("[Receipt] Upload error:", uploadError);
        throw uploadError;
      }
      console.log("[Receipt] Upload success:", uploadData?.path);

      const { data: urlData } = supabase.storage
        .from("payment_receipts")
        .getPublicUrl(uploadData?.path || path);

      const receiptUrl = urlData.publicUrl;
      console.log("[Receipt] Public URL:", receiptUrl);

      // Update subscription with receipt URL and status
      const { error: updateError } = await supabase
        .from("provider_subscriptions")
        .update({
          receipt_url: receiptUrl,
          status: "under_review",
          payment_status: "receipt_submitted",
        })
        .eq("id", sub.id);

      if (updateError) {
        console.error("[Receipt] DB update error:", updateError);
        throw updateError;
      }
      console.log("[Receipt] DB updated successfully for subscription:", sub.id);

      // Create admin notification
      const { error: notifError } = await supabase.from("admin_notifications").insert({
        provider_id: user.id,
        type: "receipt_uploaded",
        message: `Provider uploaded payment receipt for ${plan?.display_name || plan?.name} plan.`,
      });
      if (notifError) console.error("[Receipt] Notification insert error:", notifError);

      // Create audit log
      const { error: auditError } = await supabase.from("subscription_audit_logs").insert({
        subscription_id: sub.id,
        action: "receipt_uploaded",
        notes: "Provider uploaded payment proof.",
      });
      if (auditError) console.error("[Receipt] Audit log error:", auditError);

      toast({
        title: "Receipt uploaded",
        description: "Your payment has been submitted and is under review.",
      });

      navigate("/provider/pending", { replace: true });
    } catch (err: any) {
      console.error("[Receipt] Full error:", err);
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Skeleton className="h-96 w-full max-w-lg rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg space-y-6"
      >
        <div className="text-center">
          <CreditCard size={32} className="mx-auto text-primary mb-3" />
          <h1 className="text-2xl font-extrabold text-foreground">Complete Payment</h1>
          <p className="text-muted-foreground mt-1">
            Finalize your <span className="font-semibold text-foreground">{plan?.display_name || plan?.name}</span> subscription
          </p>
        </div>

        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="text-lg">Payment Details</CardTitle>
            <CardDescription>Transfer the amount below and upload your receipt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-accent/50">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="font-semibold text-foreground">{plan?.display_name || plan?.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-accent/50">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-bold text-xl text-primary">${plan?.price_monthly}/month</span>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-sm">Payment Instructions</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Transfer to the following account:</p>
                <p className="font-medium text-foreground">Bank: Dahabshiil / Hormuud EVC</p>
                <p className="font-medium text-foreground">Account: Somopportunity Inc.</p>
                <p className="font-medium text-foreground">Reference: Your registered email</p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 rounded-lg p-3">
              <AlertCircle size={14} className="mt-0.5 shrink-0 text-primary" />
              <span>Use your registered email as payment reference so we can verify your payment quickly.</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload size={18} className="text-primary" />
              Upload Payment Receipt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label
              htmlFor="receipt"
              className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-8 cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload size={28} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {uploading ? "Uploading…" : "Click to upload receipt (PNG, JPG, PDF — max 10MB)"}
              </span>
            </Label>
            <Input
              id="receipt"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
