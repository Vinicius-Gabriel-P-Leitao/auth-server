import { Separator } from "@components/sh-separator/separator.component";
import { cn } from "@lib/cn/cn.util";
import { type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { buttonGroupVariants } from "./button-group.variant";

/**
 * Agrupador visual para botões e addons relacionados. Suporta orientação `horizontal` (padrão) e `vertical` via prop `orientation`.
 * Use `ButtonGroupSeparator` entre itens para separação visual. O elemento raiz possui `role="group"` para acessibilidade.
 *
 * @param orientation - Direção do grupo: `"horizontal"` (padrão) ou `"vertical"`.
 * @param className - Classes CSS adicionais aplicadas ao elemento raiz.
 * @param props - Demais props nativas de `<div>`.
 *
 * @example
 * // Grupo horizontal de paginação
 * <ButtonGroup>
 *   <Button variant="outline">Anterior</Button>
 *   <ButtonGroupSeparator />
 *   <Button variant="outline">Próximo</Button>
 * </ButtonGroup>
 *
 * @example
 * // Grupo vertical de opções
 * <ButtonGroup orientation="vertical">
 *   <Button variant="outline">Opção A</Button>
 *   <ButtonGroupSeparator orientation="horizontal" />
 *   <Button variant="outline">Opção B</Button>
 * </ButtonGroup>
 */
function ButtonGroup({ className, orientation, ...props }: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

/**
 * Elemento de texto ou addon dentro de um `ButtonGroup`. Renderiza um `<div>` estilizado como addon.
 * Use `asChild` para renderizar como elemento filho via Radix Slot.
 *
 * @param className - Classes CSS adicionais.
 * @param asChild - Quando `true`, renderiza o elemento filho diretamente via Slot (padrão: `false`).
 * @param props - Demais props nativas de `<div>`.
 *
 * @example
 * // Addon com ícone e texto
 * <ButtonGroupText>
 *   <SearchIcon />
 *   Buscar
 * </ButtonGroupText>
 *
 * @example
 * // Addon como slot customizado
 * <ButtonGroupText asChild>
 *   <span>Prefixo</span>
 * </ButtonGroupText>
 */
function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      className={cn(
        "bg-muted gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 flex items-center [&_svg]:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Separador visual entre itens de um `ButtonGroup`. Por padrão, orientação `"vertical"` (linha entre botões horizontais).
 * Use `orientation="horizontal"` dentro de um grupo vertical.
 *
 * @param orientation - Orientação do separador: `"vertical"` (padrão) ou `"horizontal"`.
 * @param className - Classes CSS adicionais.
 * @param props - Demais props do componente `Separator`.
 *
 * @example
 * // Separador padrão (vertical) entre botões
 * <ButtonGroupSeparator />
 *
 * @example
 * // Separador horizontal em grupo vertical
 * <ButtonGroupSeparator orientation="horizontal" />
 */
function ButtonGroupSeparator({ className, orientation = "vertical", ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-input relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
        className,
      )}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
