export type BentoMode = "single" | "duo" | "trio" | "quad";

export interface BentoPlacement {
	featured: boolean;
}

export function getBentoMode(count: number): BentoMode {
	if (count <= 1) return "single";
	if (count === 2) return "duo";
	if (count === 3) return "trio";
	return "quad";
}

export function getBentoPlacements(count: number): BentoPlacement[] {
	if (count <= 0) return [];

	return Array.from({ length: count }, (_, index) => ({
		featured: count !== 2 && index === 0,
	}));
}
