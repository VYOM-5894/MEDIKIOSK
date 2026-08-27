import { useState } from "react";
import { FileText, X, Edit2, Save, Pill, FlaskConical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExtractedDocument, LabValue, Medication } from "@/lib/medikiosk/types";

export function DocumentCard({
  doc,
  onUpdate,
  onRemove,
}: {
  doc: ExtractedDocument;
  onUpdate: (patch: Partial<ExtractedDocument>) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(doc);

  const save = () => {
    onUpdate(local);
    setEditing(false);
  };

  const updateMed = (id: string, patch: Partial<Medication>) => {
    setLocal((d) => ({ ...d, medications: d.medications.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
  };

  const updateLab = (id: string, patch: Partial<LabValue>) => {
    setLocal((d) => ({ ...d, labs: d.labs.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  };

  const addMed = () => {
    setLocal((d) => ({
      ...d,
      medications: [...d.medications, { id: `med-${Date.now()}`, name: "", dosage: "", frequency: "" }],
    }));
  };

  const addLab = () => {
    setLocal((d) => ({
      ...d,
      labs: [...d.labs, { id: `lab-${Date.now()}`, test: "", value: "", reference: "", abnormal: false }],
    }));
  };

  const removeMed = (id: string) => setLocal((d) => ({ ...d, medications: d.medications.filter((m) => m.id !== id) }));
  const removeLab = (id: string) => setLocal((d) => ({ ...d, labs: d.labs.filter((l) => l.id !== id) }));

  return (
    <Card className="overflow-hidden border-border bg-card shadow-soft">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">{doc.fileName}</CardTitle>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{doc.kind.replace("-", " ")}</Badge>
            <span>{doc.doctor}</span>
            <span>•</span>
            <span>{doc.hospital}</span>
            <span>•</span>
            <span>{new Date(doc.date).toLocaleDateString("en-IN")}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {editing ? (
            <Button size="icon" variant="ghost" onClick={save} aria-label="Save">
              <Save className="h-4 w-4 text-success" />
            </Button>
          ) : (
            <Button size="icon" variant="ghost" onClick={() => setEditing(true)} aria-label="Edit">
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={onRemove} aria-label="Remove">
            <X className="h-4 w-4 text-emergency" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Diagnosis</Label>
                <Input value={local.diagnosis} onChange={(e) => setLocal({ ...local, diagnosis: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Date</Label>
                <Input type="date" value={local.date} onChange={(e) => setLocal({ ...local, date: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Doctor</Label>
                <Input value={local.doctor} onChange={(e) => setLocal({ ...local, doctor: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Hospital</Label>
                <Input value={local.hospital} onChange={(e) => setLocal({ ...local, hospital: e.target.value })} />
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-muted/40 p-3 text-sm text-foreground">
            <span className="font-medium">Diagnosis:</span> {doc.diagnosis}
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Pill className="h-4 w-4 text-primary" />
            Medications
          </div>
          <div className="space-y-2">
            {local.medications.length === 0 && <div className="text-xs text-muted-foreground">No medications extracted.</div>}
            {local.medications.map((m) => (
              <div key={m.id} className="grid gap-2 rounded-lg border border-border bg-card p-2 sm:grid-cols-[1fr,1fr,1fr,auto]">
                {editing ? (
                  <>
                    <Input value={m.name} placeholder="Name" onChange={(e) => updateMed(m.id, { name: e.target.value })} />
                    <Input value={m.dosage} placeholder="Dosage" onChange={(e) => updateMed(m.id, { dosage: e.target.value })} />
                    <Input value={m.frequency} placeholder="Frequency" onChange={(e) => updateMed(m.id, { frequency: e.target.value })} />
                    <Button size="icon" variant="ghost" onClick={() => removeMed(m.id)}><X className="h-4 w-4 text-emergency" /></Button>
                  </>
                ) : (
                  <div className="col-span-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{m.name}</span> {m.dosage} — {m.frequency}
                  </div>
                )}
              </div>
            ))}
            {editing && <Button variant="outline" size="sm" onClick={addMed}>+ Add medication</Button>}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <FlaskConical className="h-4 w-4 text-accent" />
            Lab Values
          </div>
          <div className="space-y-2">
            {local.labs.length === 0 && <div className="text-xs text-muted-foreground">No lab values extracted.</div>}
            {local.labs.map((l) => (
              <div key={l.id} className={cn("grid gap-2 rounded-lg border p-2 sm:grid-cols-[1fr,1fr,1fr,auto,auto]", l.abnormal ? "border-emergency/30 bg-emergency/5" : "border-border bg-card")}>
                {editing ? (
                  <>
                    <Input value={l.test} placeholder="Test" onChange={(e) => updateLab(l.id, { test: e.target.value })} />
                    <Input value={l.value} placeholder="Value" onChange={(e) => updateLab(l.id, { value: e.target.value })} />
                    <Input value={l.reference} placeholder="Reference" onChange={(e) => updateLab(l.id, { reference: e.target.value })} />
                    <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={l.abnormal} onChange={(e) => updateLab(l.id, { abnormal: e.target.checked })} /> Abnormal</label>
                    <Button size="icon" variant="ghost" onClick={() => removeLab(l.id)}><X className="h-4 w-4 text-emergency" /></Button>
                  </>
                ) : (
                  <div className="col-span-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{l.test}</span> {l.value} <span className="text-xs">(ref {l.reference})</span>
                    {l.abnormal && <span className="ml-2 text-xs font-semibold text-emergency">Abnormal</span>}
                  </div>
                )}
              </div>
            ))}
            {editing && <Button variant="outline" size="sm" onClick={addLab}>+ Add lab value</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
