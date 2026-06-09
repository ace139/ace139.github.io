import { z } from "astro:content";

export const heroConfigFields = z.object({
	position: z
		.enum([
			"center",
			"top",
			"bottom",
			"left",
			"right",
			"top-left",
			"top-right",
			"bottom-left",
			"bottom-right",
		])
		.default("center"),
	aspectRatio: z
		.enum(["cinematic", "wide", "standard", "square"])
		.default("cinematic"),
	overlay: z.enum(["gradient", "dark", "light", "none"]).default("gradient"),
});

export const heroConfigSchema = heroConfigFields.optional();

export type HeroConfig = z.infer<typeof heroConfigFields>;

const aspectRatioMap: Record<
	HeroConfig["aspectRatio"],
	{ desktop: string; mobile: string }
> = {
	cinematic: { desktop: "21/9", mobile: "16/9" },
	wide: { desktop: "2/1", mobile: "16/9" },
	standard: { desktop: "16/9", mobile: "4/3" },
	square: { desktop: "4/3", mobile: "1/1" },
};

const positionMap: Record<HeroConfig["position"], string> = {
	center: "center center",
	top: "center top",
	bottom: "center bottom",
	left: "left center",
	right: "right center",
	"top-left": "left top",
	"top-right": "right top",
	"bottom-left": "left bottom",
	"bottom-right": "right bottom",
};

export function resolveHeroConfig(heroConfig?: HeroConfig) {
	const aspectRatio = heroConfig?.aspectRatio ?? "cinematic";
	const position = heroConfig?.position ?? "center";

	return {
		aspectRatio,
		position,
		overlay: heroConfig?.overlay ?? "gradient",
		aspectDesktop: aspectRatioMap[aspectRatio].desktop,
		aspectMobile: aspectRatioMap[aspectRatio].mobile,
		objectPosition: positionMap[position],
	};
}
