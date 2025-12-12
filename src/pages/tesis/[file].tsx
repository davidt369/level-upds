import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { GetServerSideProps } from 'next'

type Props = {
  fileName?: string
  content?: string
  denied?: boolean
}

export default function FilePage({ fileName, content, denied }: Props) {
  if (denied) {
    return (
      <div style={{ padding: 20 }}>
        <p>Acceso denegado.</p>
        <p>
          <Link href="/tesis">Volver</Link>
        </p>
      </div>
    )
  }

  if (!fileName) {
    return (
      <div style={{ padding: 20 }}>
        <p>Archivo no encontrado.</p>
        <p>
          <Link href="/tesis">Volver</Link>
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{fileName}</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>
      <p>
        <Link href="/tesis">Volver</Link>
      </p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const raw = ctx.params?.file
  if (!raw || Array.isArray(raw)) {
    return { props: {} }
  }

  const fileParam = decodeURIComponent(raw)
  const dir = path.join(process.cwd(), 'TESIS_DOCUMENTOS')
  const filePath = path.join(dir, fileParam)
  const normalized = path.normalize(filePath)

  if (!normalized.startsWith(dir)) {
    return { props: { denied: true } }
  }

  if (!fs.existsSync(normalized)) {
    return { props: {} }
  }

  try {
    const content = fs.readFileSync(normalized, 'utf8')
    return { props: { fileName: fileParam, content } }
  } catch (e) {
    return { props: { fileName: fileParam, content: 'Error leyendo el archivo.' } }
  }
}
