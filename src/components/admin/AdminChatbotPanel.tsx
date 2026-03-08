import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  MessageCircle, Save, Plus, Trash2, Edit, Eye, X,
  Loader2, BookOpen, Settings, MessagesSquare, Brain, ToggleLeft
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function AdminChatbotPanel() {
  const [subtab, setSubtab] = useState<"config" | "knowledge" | "conversations">("config");

  // Config state
  const [systemPrompt, setSystemPrompt] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [botName, setBotName] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);

  // Knowledge base
  const [knowledgeItems, setKnowledgeItems] = useState<any[]>([]);
  const [kbForm, setKbForm] = useState({ title: "", content: "", category: "general" });
  const [editingKb, setEditingKb] = useState<string | null>(null);
  const [showKbForm, setShowKbForm] = useState(false);
  const [savingKb, setSavingKb] = useState(false);

  // Conversations
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<any>(null);
  const [convoMessages, setConvoMessages] = useState<any[]>([]);
  const [loadingConvos, setLoadingConvos] = useState(false);

  useEffect(() => {
    loadConfig();
    loadKnowledge();
    loadConversations();
  }, []);

  const loadConfig = async () => {
    const { data } = await supabase.from("ai_chat_config" as any).select("*");
    if (data) {
      const cfg: Record<string, string> = {};
      (data as any[]).forEach(r => { cfg[r.key] = r.value; });
      setSystemPrompt(cfg.system_prompt || "");
      setWelcomeMessage(cfg.welcome_message || "");
      setBotName(cfg.bot_name || "");
      setIsEnabled(cfg.is_enabled !== "false");
    }
  };

  const saveConfig = async () => {
    setSavingConfig(true);
    const updates = [
      { key: "system_prompt", value: systemPrompt },
      { key: "welcome_message", value: welcomeMessage },
      { key: "bot_name", value: botName },
      { key: "is_enabled", value: isEnabled ? "true" : "false" },
    ];
    for (const u of updates) {
      await supabase.from("ai_chat_config" as any).update({ value: u.value, updated_at: new Date().toISOString() } as any).eq("key", u.key);
    }
    toast({ title: "Chat configuration saved!" });
    setSavingConfig(false);
  };

  const loadKnowledge = async () => {
    const { data } = await supabase.from("ai_knowledge_base" as any).select("*").order("created_at", { ascending: false });
    if (data) setKnowledgeItems(data as any[]);
  };

  const handleSaveKb = async () => {
    if (!kbForm.title || !kbForm.content) { toast({ title: "Title and content required" }); return; }
    setSavingKb(true);
    if (editingKb) {
      await supabase.from("ai_knowledge_base" as any).update({
        title: kbForm.title, content: kbForm.content, category: kbForm.category, updated_at: new Date().toISOString()
      } as any).eq("id", editingKb);
      toast({ title: "Knowledge entry updated!" });
    } else {
      await supabase.from("ai_knowledge_base" as any).insert({
        title: kbForm.title, content: kbForm.content, category: kbForm.category,
      } as any);
      toast({ title: "Knowledge entry added!" });
    }
    setKbForm({ title: "", content: "", category: "general" });
    setEditingKb(null);
    setShowKbForm(false);
    setSavingKb(false);
    loadKnowledge();
  };

  const handleDeleteKb = async (id: string) => {
    await supabase.from("ai_knowledge_base" as any).delete().eq("id", id);
    toast({ title: "Knowledge entry deleted" });
    loadKnowledge();
  };

  const handleToggleKb = async (id: string, active: boolean) => {
    await supabase.from("ai_knowledge_base" as any).update({ is_active: !active } as any).eq("id", id);
    loadKnowledge();
  };

  const loadConversations = async () => {
    setLoadingConvos(true);
    const { data } = await supabase.from("chat_conversations" as any).select("*, chat_messages(count)").order("updated_at", { ascending: false }).limit(50);
    if (data) setConversations(data as any[]);
    setLoadingConvos(false);
  };

  const viewConversation = async (convo: any) => {
    setSelectedConvo(convo);
    const { data } = await supabase.from("chat_messages" as any).select("*").eq("conversation_id", convo.id).order("created_at", { ascending: true });
    if (data) setConvoMessages(data as any[]);
  };

  const subtabs = [
    { id: "config" as const, icon: Settings, label: "Configuration" },
    { id: "knowledge" as const, icon: BookOpen, label: "Knowledge Base" },
    { id: "conversations" as const, icon: MessagesSquare, label: "Conversations" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
          <Brain className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="font-bold text-lg">AI Chat Assistant</h2>
          <p className="text-xs text-muted-foreground">Configure, train, and monitor your AI chatbot</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg w-fit">
        {subtabs.map(st => (
          <button
            key={st.id}
            onClick={() => setSubtab(st.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              subtab === st.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <st.icon className="h-3.5 w-3.5" /> {st.label}
          </button>
        ))}
      </div>

      {/* CONFIG TAB */}
      {subtab === "config" && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Chat Status</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{isEnabled ? "Enabled" : "Disabled"}</span>
                <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Bot Name</Label>
              <Input value={botName} onChange={e => setBotName(e.target.value)} placeholder="e.g. SHAHEB Assistant" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Welcome Message</Label>
              <Textarea value={welcomeMessage} onChange={e => setWelcomeMessage(e.target.value)} placeholder="First message customers see" rows={2} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">System Prompt (AI Personality & Instructions)</Label>
              <p className="text-[10px] text-muted-foreground">This defines how the AI behaves, its tone, and what it knows. The knowledge base entries are automatically appended.</p>
              <Textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={8} className="font-mono text-xs" />
            </div>

            <Button onClick={saveConfig} disabled={savingConfig} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full gap-2">
              {savingConfig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Configuration
            </Button>
          </div>
        </div>
      )}

      {/* KNOWLEDGE BASE TAB */}
      {subtab === "knowledge" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">Knowledge Base</h3>
              <p className="text-[10px] text-muted-foreground">Add information the AI will use to answer questions accurately</p>
            </div>
            <Button onClick={() => { setShowKbForm(true); setEditingKb(null); setKbForm({ title: "", content: "", category: "general" }); }} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1">
              <Plus className="h-3.5 w-3.5" /> Add Entry
            </Button>
          </div>

          {showKbForm && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{editingKb ? "Edit Entry" : "New Knowledge Entry"}</h4>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setShowKbForm(false); setEditingKb(null); }}><X className="h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-xs">Title</Label><Input value={kbForm.title} onChange={e => setKbForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Shipping Policy" /></div>
                <div className="space-y-2">
                  <Label className="text-xs">Category</Label>
                  <Select value={kbForm.category} onValueChange={v => setKbForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["general", "shipping", "returns", "sizing", "payments", "products", "promotions", "custom"].map(c => (
                        <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Content</Label>
                <Textarea value={kbForm.content} onChange={e => setKbForm(f => ({ ...f, content: e.target.value }))} rows={4} placeholder="Write the information the AI should know..." />
              </div>
              <Button onClick={handleSaveKb} disabled={savingKb} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1">
                {savingKb ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} {editingKb ? "Update" : "Save"} Entry
              </Button>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow><TableHead className="text-xs">Title</TableHead><TableHead className="text-xs">Category</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs text-right">Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {knowledgeItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-sm">{item.title}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] capitalize">{item.category}</Badge></TableCell>
                    <TableCell>
                      <button onClick={() => handleToggleKb(item.id, item.is_active)}>
                        <Badge className={item.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}>
                          {item.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                          setKbForm({ title: item.title, content: item.content, category: item.category });
                          setEditingKb(item.id);
                          setShowKbForm(true);
                        }}><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteKb(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {knowledgeItems.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground text-sm py-8">No knowledge base entries yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* CONVERSATIONS TAB */}
      {subtab === "conversations" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Customer Conversations</h3>
            <Button variant="outline" className="rounded-full text-xs" onClick={loadConversations}>Refresh</Button>
          </div>

          {selectedConvo ? (
            <div className="space-y-4">
              <Button variant="ghost" className="text-xs gap-1" onClick={() => { setSelectedConvo(null); setConvoMessages([]); }}>
                ← Back to conversations
              </Button>
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-sm">Conversation</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(selectedConvo.created_at).toLocaleString("en-IN")}
                      {selectedConvo.session_id && " · Guest"}
                    </p>
                  </div>
                  <Badge variant="outline">{selectedConvo.status}</Badge>
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {convoMessages.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`rounded-2xl px-3.5 py-2.5 max-w-[80%] text-sm ${
                        msg.role === "user" ? "bg-accent text-accent-foreground" : "bg-secondary"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {convoMessages.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No messages in this conversation</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversations.map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-sm">{new Date(c.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{c.user_id ? "User" : "Guest"}</Badge></TableCell>
                      <TableCell><Badge className={c.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}>{c.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => viewConversation(c)}>
                          <Eye className="h-3 w-3" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {conversations.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground text-sm py-8">
                      {loadingConvos ? "Loading..." : "No conversations yet"}
                    </TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
