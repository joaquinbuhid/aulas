"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { Trash2 } from "lucide-react"

interface Aula {
  id: number
  nombre: string
  edificios: { nombre: string }
}

interface Movimiento {
  id: number
  aula_id: number
  hora_desde: string
  hora_hasta: string
  asignatura: string
  carrera: string
  docente: string
  aulas: { nombre: string; edificios: { nombre: string } }
}

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [aulas, setAulas] = useState<Aula[]>([])
  const [aulaId, setAulaId] = useState("")
  const [horaDesde, setHoraDesde] = useState("")
  const [horaHasta, setHoraHasta] = useState("")
  const [asignatura, setAsignatura] = useState("")
  const [carrera, setCarrera] = useState("")
  const [docente, setDocente] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAulas()
    fetchMovimientos()
  }, [])

  async function fetchAulas() {
    const { data } = await supabase
      .from("aulas")
      .select("*, edificios(nombre)")
      .order("nombre")
    setAulas(data || [])
  }

  async function fetchMovimientos() {
    const { data, error } = await supabase
      .from("movimientos")
      .select("*, aulas(nombre, edificios(nombre))")
      .order("created_at", { ascending: false })

    if (!error) {
      setMovimientos(data || [])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!aulaId || !horaDesde || !horaHasta || !asignatura.trim() || !carrera.trim() || !docente.trim()) return

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.from("movimientos").insert([
      {
        aula_id: parseInt(aulaId),
        hora_desde: horaDesde,
        hora_hasta: horaHasta,
        asignatura: asignatura.trim(),
        carrera: carrera.trim(),
        docente: docente.trim(),
      },
    ])

    if (error) {
      setMessage({ type: "error", text: "Error al guardar el movimiento" })
    } else {
      setMessage({ type: "success", text: "Movimiento guardado correctamente" })
      setAulaId("")
      setHoraDesde("")
      setHoraHasta("")
      setAsignatura("")
      setCarrera("")
      setDocente("")
      fetchMovimientos()
    }
    setLoading(false)
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("movimientos").delete().eq("id", id)
    if (!error) {
      setMessage({ type: "success", text: "Movimiento eliminado" })
      fetchMovimientos()
    } else {
      setMessage({ type: "error", text: "Error al eliminar el movimiento" })
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <PageHeader 
          title="Movimientos" 
          description="Registra el uso de aulas por horario, asignatura y docente"
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Movimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aula">Aula</Label>
                  <Select value={aulaId} onValueChange={setAulaId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar aula" />
                    </SelectTrigger>
                    <SelectContent>
                      {aulas.map((aula) => (
                        <SelectItem key={aula.id} value={aula.id.toString()}>
                          {aula.nombre} - {aula.edificios?.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horaDesde">Hora Desde</Label>
                    <Input
                      id="horaDesde"
                      type="time"
                      value={horaDesde}
                      onChange={(e) => setHoraDesde(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaHasta">Hora Hasta</Label>
                    <Input
                      id="horaHasta"
                      type="time"
                      value={horaHasta}
                      onChange={(e) => setHoraHasta(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asignatura">Asignatura</Label>
                  <Input
                    id="asignatura"
                    placeholder="Ej: Matemáticas I"
                    value={asignatura}
                    onChange={(e) => setAsignatura(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carrera">Carrera</Label>
                  <Input
                    id="carrera"
                    placeholder="Ej: Ingeniería en Sistemas"
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="docente">Docente</Label>
                  <Input
                    id="docente"
                    placeholder="Ej: Prof. Juan Pérez"
                    value={docente}
                    onChange={(e) => setDocente(e.target.value)}
                    required
                  />
                </div>

                {message && (
                  <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {message.text}
                  </p>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Guardando..." : "Guardar Movimiento"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Movimientos Registrados</CardTitle>
            </CardHeader>
            <CardContent>
              {movimientos.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No hay movimientos registrados</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aula</TableHead>
                        <TableHead>Horario</TableHead>
                        <TableHead>Asignatura</TableHead>
                        <TableHead>Carrera</TableHead>
                        <TableHead>Docente</TableHead>
                        <TableHead className="w-20">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movimientos.map((mov) => (
                        <TableRow key={mov.id}>
                          <TableCell className="font-medium">
                            {mov.aulas?.nombre}
                            <span className="block text-xs text-muted-foreground">
                              {mov.aulas?.edificios?.nombre}
                            </span>
                          </TableCell>
                          <TableCell>
                            {mov.hora_desde} - {mov.hora_hasta}
                          </TableCell>
                          <TableCell>{mov.asignatura}</TableCell>
                          <TableCell>{mov.carrera}</TableCell>
                          <TableCell>{mov.docente}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(mov.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
