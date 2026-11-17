import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { SkillId } from '../content'

/** Compétence survolée/sélectionnée : met en évidence où elle a servi. */
interface H {
  skill: SkillId | null
  setSkill: (s: SkillId | null) => void
}
const Ctx = createContext<H>({ skill: null, setSkill: () => {} })

export function HighlightProvider({ children }: { children: ReactNode }) {
  const [skill, setSkill] = useState<SkillId | null>(null)
  const v = useMemo(() => ({ skill, setSkill }), [skill])
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>
}

export const useHighlight = () => useContext(Ctx)

/** Attributs à poser sur un élément porteur de tags. */
export function useMatch(tags: SkillId[]) {
  const { skill } = useHighlight()
  if (!skill) return {}
  return tags.includes(skill) ? { 'data-match': '' } : { 'data-dimmed': '' }
}
