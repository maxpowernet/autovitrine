/** Lê uma imagem, reduz para no máximo `max` px e devolve um data URL JPEG (cabe no localStorage). */
export function lerImagem(arquivo: File, max = 1000, qualidade = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!arquivo.type.startsWith('image/')) return reject(new Error('Arquivo não é uma imagem'))
    const leitor = new FileReader()
    leitor.onerror = () => reject(new Error('Falha ao ler o arquivo'))
    leitor.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Imagem inválida'))
      img.onload = () => {
        const escala = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * escala)
        canvas.height = Math.round(img.height * escala)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', qualidade))
      }
      img.src = leitor.result as string
    }
    leitor.readAsDataURL(arquivo)
  })
}
