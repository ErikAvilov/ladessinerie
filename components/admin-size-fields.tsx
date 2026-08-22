'use client'

type SizeField = {
  size: string
  price: string
}

type AdminSizeFieldsProps = {
  fields: SizeField[]
  onChange: (fields: SizeField[]) => void
}

export function AdminSizeFields({ fields, onChange }: AdminSizeFieldsProps) {
  function updateField(index: number, key: keyof SizeField, value: string) {
    onChange(fields.map((field, i) => (i === index ? { ...field, [key]: value } : field)))
  }

  function addField() {
    onChange([...fields, { size: '', price: '' }])
  }

  function removeField(index: number) {
    if (fields.length === 1) {
      onChange([{ size: '', price: '' }])
      return
    }
    onChange(fields.filter((_, i) => i !== index))
  }

  return (
    <div className="md:col-span-2 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">Formats & prix</span>
        <button
          type="button"
          onClick={addField}
          className="cursor-pointer rounded-full border border-foreground/15 px-3 py-1.5 text-xs font-medium transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
        >
          + Ajouter un format
        </button>
      </div>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              type="text"
              value={field.size}
              onChange={(event) => updateField(index, 'size', event.target.value)}
              placeholder="A4"
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 outline-none transition focus:border-[var(--terracotta)]"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={field.price}
              onChange={(event) => updateField(index, 'price', event.target.value)}
              placeholder="30"
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 outline-none transition focus:border-[var(--terracotta)]"
            />
            <button
              type="button"
              onClick={() => removeField(index)}
              className="cursor-pointer rounded-xl border border-foreground/15 px-4 py-3 text-sm transition hover:border-[var(--terracotta)] hover:text-[var(--terracotta)]"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export type { SizeField }
