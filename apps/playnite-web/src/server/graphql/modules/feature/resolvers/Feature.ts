import { create } from '../../../../oid'
import type { FeatureResolvers } from './../../../types.generated'

export const Feature: FeatureResolvers = {
  id: async (_parent, _arg, _ctx) => {
    return create('Feature', _parent.id).toString()
  },
  gameReleases: async (_parent, _arg, _ctx) => {
    return _ctx.api.gameRelease.getBy({ featureIds: { $in: _parent.id } })
  },
}
