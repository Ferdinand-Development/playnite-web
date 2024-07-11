import DataLoader from 'dataloader'
import { groupBy, merge, omit, toLower } from 'lodash'
import { Document, Filter } from 'mongodb'
import { createNull, fromString } from '../../../../oid'
import { GameReleaseDbEntity } from '../../../data/types'
import { autoBind, type DomainApi } from '../../../Domain'
import {
  GameEntity,
  GameReleaseEntity,
  PlatformSourceEntity,
} from '../../../resolverTypes'

const getPlatforms = (
  gameRelease: GameReleaseDbEntity | GameReleaseEntity,
): Array<PlatformSourceEntity> => {
  switch (gameRelease.source.name) {
    case 'PlayStation':
      return gameRelease.platforms.filter((platform) =>
        toLower(platform.name).includes('playstation'),
      )
    case 'Xbox':
      return gameRelease.platforms.filter((platform) =>
        toLower(platform.name).includes('xbox'),
      )
    case 'Steam':
    case 'Epic':
    case 'GOG':
    case 'Origin':
    case 'Uplay':
    case 'Battle.net':
    case 'EA':
      return gameRelease.platforms.filter(
        (platform) =>
          platform.name === 'PC (Windows)' ||
          platform.name === 'Linux' ||
          platform.name === 'Macintosh',
      )
    case 'Nintendo':
      return gameRelease.platforms.filter((platform) =>
        toLower(platform.name).includes('nintendo'),
      )
    default:
      return []
  }
}

const unknownPlatform = {
  id: createNull('Platform').toString(),
  name: 'Unknown',
}

const toGameEntity = (
  gameReleases: Array<GameReleaseDbEntity | GameReleaseEntity>,
): GameEntity => {
  const releasesGroupedBySource = groupBy(gameReleases, 'source.name')

  return Object.values(releasesGroupedBySource).flatMap((releases) =>
    releases.map((release, index) =>
      omit(
        merge({}, release, {
          platformSource: getPlatforms(release)[index] ?? unknownPlatform,
        }),
        '_id',
      ),
    ),
  ) as GameEntity
}

function create(this: DomainApi) {
  const loader = new DataLoader<string, GameEntity>(async (ids) => {
    const gameReleaseIds = ids.map((id) => fromString(id).id.split(','))
    return await Promise.all(
      gameReleaseIds.map(async (ids) => {
        const releases = await Promise.all(
          ids.map((id) => {
            return this.gameRelease.getById(id)
          }),
        )
        return toGameEntity(releases)
      }),
    )
  })

  return autoBind(this, {
    async getById(this: DomainApi, id: string) {
      return loader.load(id)
    },
    async getAll(this: DomainApi) {
      const gameReleases = await this.gameRelease.getAll()
      const groupedReleases = groupBy(gameReleases, (game) => game.name)
      return Object.values(groupedReleases).map((releases) =>
        toGameEntity(releases),
      )
    },
    async getBy(this: DomainApi, query: Filter<Document>) {
      throw new Error('Not implemented')
    },
  })
}

export default create
