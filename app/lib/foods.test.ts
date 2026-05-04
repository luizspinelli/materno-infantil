import { describe, expect, it } from "vitest";
import { ALIMENTOS, Categoria, validarPrato } from "./foods";

const PRATO_VAZIO: Record<Categoria, string[]> = {
  cereais: [],
  feijoes: [],
  "carnes-ovos": [],
  "legumes-verduras": [],
  frutas: [],
};

const id = (nome: string) => {
  const a = ALIMENTOS.find((x) => x.id === nome);
  if (!a) throw new Error(`alimento ${nome} não existe no dataset`);
  return a.id;
};

describe("validarPrato", () => {
  it("retorna nivel vazio quando não há alimentos", () => {
    const r = validarPrato(PRATO_VAZIO);
    expect(r.nivel).toBe("vazio");
    expect(r.total).toBe(0);
    expect(r.pratoCompleto).toBe(false);
  });

  it("retorna perfeito quando 4 obrigatórios + 0 inapropriados", () => {
    const r = validarPrato({
      ...PRATO_VAZIO,
      cereais: [id("arroz")],
      feijoes: [id("feijao")],
      "carnes-ovos": [id("frango")],
      "legumes-verduras": [id("brocolis")],
    });
    expect(r.nivel).toBe("perfeito");
    expect(r.pratoCompleto).toBe(true);
    expect(r.obrigatoriosPresentes).toBe(4);
    expect(r.inapropriados).toBe(0);
    expect(r.temFruta).toBe(false);
  });

  it("retorna perfeito com fruta e mensagem específica", () => {
    const r = validarPrato({
      ...PRATO_VAZIO,
      cereais: [id("arroz")],
      feijoes: [id("feijao")],
      "carnes-ovos": [id("ovo")],
      "legumes-verduras": [id("cenoura")],
      frutas: [id("banana")],
    });
    expect(r.nivel).toBe("perfeito");
    expect(r.temFruta).toBe(true);
    expect(r.mensagem).toMatch(/fruta como complemento/);
  });

  it("retorna bom quando 4 obrigatórios + algum inapropriado", () => {
    const r = validarPrato({
      ...PRATO_VAZIO,
      cereais: [id("arroz")],
      feijoes: [id("feijao")],
      "carnes-ovos": [id("frango")],
      "legumes-verduras": [id("brocolis")],
      frutas: [id("refrigerante")],
    });
    expect(r.nivel).toBe("bom");
    expect(r.pratoCompleto).toBe(true);
    expect(r.inapropriados).toBe(1);
  });

  it("retorna incompleto quando falta grupo obrigatório, sem inapropriados", () => {
    const r = validarPrato({
      ...PRATO_VAZIO,
      cereais: [id("arroz")],
      feijoes: [id("feijao")],
      "legumes-verduras": [id("brocolis")],
      // falta carnes-ovos
    });
    expect(r.nivel).toBe("incompleto");
    expect(r.pratoCompleto).toBe(false);
    expect(r.obrigatoriosFaltando).toEqual(["carnes-ovos"]);
  });

  it("retorna ruim quando falta grupo + tem inapropriados", () => {
    const r = validarPrato({
      ...PRATO_VAZIO,
      cereais: [id("arroz")],
      "carnes-ovos": [id("salsicha")],
    });
    expect(r.nivel).toBe("ruim");
    expect(r.inapropriados).toBe(1);
    expect(r.obrigatoriosFaltando.length).toBeGreaterThan(0);
  });

  it("não conta alimento inapropriado como contribuição para grupo", () => {
    const r = validarPrato({
      ...PRATO_VAZIO,
      cereais: [id("arroz")],
      feijoes: [id("feijao")],
      "carnes-ovos": [id("nuggets")],
      "legumes-verduras": [id("brocolis")],
    });
    expect(r.pratoCompleto).toBe(false);
    expect(r.obrigatoriosFaltando).toContain("carnes-ovos");
  });

  it("deduplica alimentos repetidos em zonas diferentes", () => {
    const r = validarPrato({
      ...PRATO_VAZIO,
      cereais: [id("arroz")],
      feijoes: [id("arroz")],
    });
    expect(r.itens.length).toBe(1);
  });

  it("ignora ids inválidos", () => {
    const r = validarPrato({
      ...PRATO_VAZIO,
      cereais: ["alimento-fantasma"],
    });
    expect(r.itens.length).toBe(0);
    expect(r.nivel).toBe("vazio");
  });

  it("inclui motivo nos alimentos inapropriados", () => {
    const r = validarPrato({
      ...PRATO_VAZIO,
      cereais: [id("mel")],
    });
    const item = r.itens.find((i) => i.alimento.id === "mel");
    expect(item?.status).toBe("inapropriado");
    expect(item?.alimento.motivo).toMatch(/botulismo/i);
  });
});

describe("dataset ALIMENTOS", () => {
  it("não tem ids duplicados", () => {
    const ids = ALIMENTOS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todo alimento apropriado tem categoria definida", () => {
    const semCategoria = ALIMENTOS.filter((a) => a.apropriado && !a.categoria);
    expect(semCategoria).toHaveLength(0);
  });

  it("todo alimento inapropriado tem motivo", () => {
    const semMotivo = ALIMENTOS.filter((a) => !a.apropriado && !a.motivo);
    expect(semMotivo).toHaveLength(0);
  });
});
