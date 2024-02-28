import { Bytes, log } from '@graphprotocol/graph-ts'
import { Transfer as TransferEvent } from '../generated/SomeERC20/IERC20'
import { Child, Parent } from '../generated/schema'

export function handleTransfer(event: TransferEvent): void {
  log.info('Transfer event detected: Transfer({},{},{}) at block {} and tx {}', [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.value.toString(),
    event.block.number.toString(),
    event.transaction.hash.toHex(),
  ])

  const parentId = Bytes.fromHexString('0x1000')

  // on the first event, load some parent entity and create children
  let parent = Parent.load(parentId)
  if (parent == null) {
    log.info('Creating parent entity', [parentId.toHexString()])
    parent = new Parent(parentId)
    parent.name = 'Parent'
    parent.save()

    const child1 = new Child(Bytes.fromHexString('0x1001'))
    child1.name = 'Child1'
    child1.parent = parentId
    child1.save()

    const child2 = new Child(Bytes.fromHexString('0x1002'))
    child2.name = 'Child2'
    child2.parent = parentId
    child2.save()

    return
  }

  log.info('Parent entity already exists', [parentId.toHexString()])
  // on the next event, try to load the children from the parent

  // this breaks:
  let children = parent.children.load()
  for (let i = 0; i < children.length; i++) {
    log.info('Child: {}', [children[i].name])
  }
}
