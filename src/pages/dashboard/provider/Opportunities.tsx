import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const oppTypes = ["job", "internship", "scholarship", "fellowship", "event", "competition", "conference", "grant"];

interface OppForm {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  deadline: string;
  external_link: string;
}

const emptyForm: OppForm = {
  title: "", company: "", location: "", type: "job",
  description: "", requirements: "", deadline: "", external_link: "",
};

export default function Opportunities() {
  const { user } = useAuth();
  const [opps, setOpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<OppForm>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [postingLimit, setPostingLimit] = useState<number | null>(null);
  const [subApproved, setSubApproved] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchOpps();
    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    const { data } = await supabase
      .from("provider_subscriptions")
      .select("status, subscription_plans(posting_limit)")
      .eq("provider_id", user!.id)
      .single();

    if (data) {
      setSubApproved(data.status === "approved");
      setPostingLimit((data.subscription_plans as any)?.posting_limit ?? null);
    }
  };

  const fetchOpps = async () => {
    const { data } = await supabase
      .from("opportunities")
      .select("*")
      .eq("provider_id", user!.id)
      .order("created_at", { ascending: false });
    setOpps(data || []);
    setLoading(false);
  };

  const canPost = () => {
    if (!subApproved) return false;
    if (postingLimit === null) return true; // unlimited
    return opps.length < postingLimit;
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await supabase.from("opportunities").update({
          title: form.title, company: form.company, location: form.location,
          type: form.type, description: form.description, requirements: form.requirements,
          deadline: form.deadline || null, external_link: form.external_link || null,
        }).eq("id", editId);
        toast({ title: "Opportunity updated" });
      } else {
        if (!canPost()) {
          toast({ title: "Posting limit reached", description: "Upgrade your plan to post more.", variant: "destructive" });
          setSaving(false);
          return;
        }
        await supabase.from("opportunities").insert({
          title: form.title, company: form.company, location: form.location,
          type: form.type, description: form.description, requirements: form.requirements,
          deadline: form.deadline || null, external_link: form.external_link || null,
          provider_id: user!.id,
        });
        toast({ title: "Opportunity created" });
      }
      setDialogOpen(false);
      setForm(emptyForm);
      setEditId(null);
      fetchOpps();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "active" ? "inactive" : "active";
    await supabase.from("opportunities").update({ status: newStatus }).eq("id", id);
    fetchOpps();
  };

  const deleteOpp = async (id: string) => {
    // Note: delete policy doesn't exist, so we unpublish instead
    await supabase.from("opportunities").update({ status: "deleted" }).eq("id", id);
    toast({ title: "Opportunity removed" });
    fetchOpps();
  };

  const openEdit = (opp: any) => {
    setForm({
      title: opp.title, company: opp.company || "", location: opp.location || "",
      type: opp.type, description: opp.description || "", requirements: opp.requirements || "",
      deadline: opp.deadline ? opp.deadline.split("T")[0] : "", external_link: opp.external_link || "",
    });
    setEditId(opp.id);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Opportunities</h1>
          <p className="text-sm text-muted-foreground">
            {postingLimit ? `${opps.filter(o => o.status !== "deleted").length} / ${postingLimit} used` : "Unlimited postings"}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button
              className="btn-gradient rounded-lg font-semibold"
              disabled={!canPost()}
            >
              <Plus size={18} className="mr-1" /> New Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit" : "Create"} Opportunity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Organization</Label>
                  <Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {oppTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Deadline</Label>
                  <Input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Requirements</Label>
                <Textarea rows={3} value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>External Apply Link</Label>
                <Input value={form.external_link} onChange={e => setForm(f => ({ ...f, external_link: e.target.value }))} placeholder="https://..." />
              </div>
              <Button onClick={handleSave} disabled={saving} className="btn-gradient w-full rounded-lg font-semibold">
                {saving ? "Saving…" : editId ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!subApproved && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4 text-sm text-amber-800">
            ⏳ Your subscription is pending admin approval. Opportunity posting will be unlocked once approved.
          </CardContent>
        </Card>
      )}

      {opps.filter(o => o.status !== "deleted").length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            No opportunities yet. Create your first one!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {opps.filter(o => o.status !== "deleted").map((opp, i) => (
            <motion.div key={opp.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="glow-border">
                <CardContent className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground truncate">{opp.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {opp.company} · {opp.location} · <span className="capitalize">{opp.type}</span>
                    </p>
                  </div>
                  <Badge className={opp.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}>
                    {opp.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(opp.id, opp.status)}>
                      {opp.status === "active" ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(opp)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteOpp(opp.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
