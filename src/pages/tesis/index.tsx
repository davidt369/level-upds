import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { GetServerSideProps } from 'next'

type Props = {
  files: string[]
}

export default function TesisPage({ files }: Props) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Archivos en TESIS_DOCUMENTOS</h1>
      {files.length === 0 ? (
        <p>No se encontraron archivos en `TESIS_DOCUMENTOS`.</p>
      ) : (
        <ul>
          {files.map((f) => (
            <li key={f}>
              <Link href={`/tesis/${encodeURIComponent(f)}`}>{f}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const dir = path.join(process.cwd(), 'TESIS_DOCUMENTOS')
  let files: string[] = []
  try {
    if (fs.existsSync(dir)) {
      files = fs.readdirSync(dir)
    }
  } catch (e) {
    // ignore
  }

  return {
    props: {
      files,
    },
  }
}
