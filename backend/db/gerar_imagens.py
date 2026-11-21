"""Gera as imagens de exemplo usadas por V2_2__carga_de_aulas.sql, em backend/db/fotos.

Uso (precisa do Pillow):
    pip install pillow
    python backend/db/gerar_imagens.py

São imagens de exemplo, no mesmo estilo das que vieram com o projeto. Para usar fotos reais, troque
os arquivos de backend/db/fotos mantendo o mesmo nome: a migração só referencia o nome do arquivo.
"""
from pathlib import Path

from PIL import Image, ImageColor, ImageDraw, ImageFont

DESTINO = Path(__file__).resolve().parent / "fotos"

# (fundo, cartão) de cada categoria
CORES = {
    "computacao": ("#17408a", "#2f63c0"),
    "automacao": ("#8a4a0c", "#b8651a"),
    "construcao": ("#55483a", "#7d6a55"),
    "matematica": ("#4a2f82", "#6f4cb3"),
    "meio-ambiente": ("#215c3a", "#3a8a5c"),
    "outras": ("#16789a", "#3d9fbf"),
}

# (categoria, título, número de fotos). A posição na lista dá o número do arquivo:
# a 1ª aula gera aula-01-1.jpg, aula-01-2.jpg...; a ordem tem de ser a mesma do V2_2__carga_de_aulas.sql.
AULAS = [
    ('computacao', 'Lógica de programação com Python do zero', 2),
    ('computacao', 'Banco de dados e SQL na prática', 1),
    ('computacao', 'HTML e CSS: monte sua primeira página', 2),
    ('computacao', 'JavaScript para quem já sabe HTML e CSS', 1),
    ('computacao', 'Git e GitHub para trabalhos em equipe', 1),
    ('computacao', 'Estruturas de dados em Java', 3),
    ('computacao', 'Monitoria de Algoritmos', 1),
    ('automacao', 'Arduino na prática: LEDs, sensores e motores', 3),
    ('automacao', 'Controle PID: teoria e simulação', 1),
    ('automacao', 'Comandos elétricos: partida direta e reversão', 2),
    ('automacao', 'Como usar o multímetro sem erro', 1),
    ('automacao', 'CLP: introdução à programação em Ladder', 1),
    ('construcao', 'Desenho técnico e leitura de plantas', 2),
    ('construcao', 'AutoCAD 2D: do básico às plantas baixas', 3),
    ('construcao', 'Resistência dos materiais: exercícios resolvidos', 1),
    ('construcao', 'Topografia: nível e estação total em campo', 1),
    ('matematica', 'Pré-cálculo: funções e gráficos', 2),
    ('matematica', 'Cálculo I: limites e derivadas', 1),
    ('matematica', 'Matemática básica para o ENEM', 2),
    ('matematica', 'Álgebra linear: matrizes e sistemas', 1),
    ('meio-ambiente', 'Gestão de resíduos sólidos: conceitos e casos', 2),
    ('meio-ambiente', 'Qualidade da água: análises em laboratório', 1),
    ('outras', 'Inglês técnico para ler documentação', 1),
    ('outras', 'Excel para planilhas acadêmicas', 1),
    ('outras', 'Relatórios técnicos e normas ABNT', 1),
]

# (nome do arquivo, iniciais, cor) -> usuario-<nome>.jpg
USUARIOS = [
    ('mariana-duarte', 'MD', '#2f5aa0'),
    ('lucas-nunes', 'LN', '#2a7f62'),
    ('beatriz-lacerda', 'BL', '#7a4aa8'),
    ('rafael-cavalcanti', 'RC', '#b8651a'),
    ('camila-medeiros', 'CM', '#a0455a'),
    ('pedro-gomes', 'PG', '#4a5568'),
    ('ana-pereira', 'AP', '#2e7d4f'),
]


def fonte(tamanho):
    for nome in ("arialbd.ttf", "Arial Bold.ttf", "DejaVuSans-Bold.ttf", "LiberationSans-Bold.ttf"):
        try:
            return ImageFont.truetype(nome, tamanho)
        except OSError:
            pass
    try:
        return ImageFont.load_default(tamanho)
    except TypeError:  # Pillow antigo, sem tamanho
        return ImageFont.load_default()


def quebrar(desenho, texto, f, largura):
    linhas, atual = [], ""
    for palavra in texto.split():
        teste = (atual + " " + palavra).strip()
        if desenho.textlength(teste, font=f) <= largura or not atual:
            atual = teste
        else:
            linhas.append(atual)
            atual = palavra
    linhas.append(atual)
    return linhas


def centralizado(desenho, y, texto, f, cor="white"):
    largura = desenho.textlength(texto, font=f)
    desenho.text(((800 - largura) / 2, y), texto, font=f, fill=cor)


def foto_aula(categoria, titulo, numero, total, arquivo):
    fundo, cartao = CORES[categoria]
    img = Image.new("RGB", (800, 600), fundo)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((60, 60, 740, 540), radius=48, fill=cartao)
    tamanho = 60
    while True:
        f = fonte(tamanho)
        linhas = quebrar(d, titulo, f, 600)
        if len(linhas) <= 3 and all(d.textlength(l, font=f) <= 600 for l in linhas) or tamanho <= 30:
            break
        tamanho -= 4
    altura = int(tamanho * 1.25)
    y = 270 - altura * len(linhas) / 2
    for linha in linhas:
        centralizado(d, y, linha, f)
        y += altura
    centralizado(d, 400, "Foto %d de %d" % (numero, total), fonte(30))
    centralizado(d, 480, "Imagem de exemplo", fonte(22), "#e6e6e6")
    img.save(DESTINO / arquivo, quality=85)


def foto_usuario(iniciais, cor, arquivo):
    base = ImageColor.getrgb(cor)
    claro = tuple(int(c + (255 - c) * 0.35) for c in base)
    img = Image.new("RGB", (400, 400), base)
    d = ImageDraw.Draw(img)
    d.ellipse((40, 40, 360, 360), fill=claro)
    f = fonte(150)
    x0, y0, x1, y1 = d.textbbox((0, 0), iniciais, font=f)
    d.text(((400 - (x1 - x0)) / 2 - x0, (400 - (y1 - y0)) / 2 - y0), iniciais, font=f, fill="white")
    img.save(DESTINO / arquivo, quality=85)


def main():
    DESTINO.mkdir(parents=True, exist_ok=True)
    total = 0
    for i, (categoria, titulo, n) in enumerate(AULAS, start=1):
        for k in range(1, n + 1):
            foto_aula(categoria, titulo, k, n, "aula-%02d-%d.jpg" % (i, k))
            total += 1
    for nome, iniciais, cor in USUARIOS:
        foto_usuario(iniciais, cor, "usuario-%s.jpg" % nome)
        total += 1
    print("%d imagens geradas em %s" % (total, DESTINO))


if __name__ == "__main__":
    main()