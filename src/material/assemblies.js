
import allPool from './assemblies/pools'
import allMedicine from './assemblies/medicine'
import allDetectionPoint from './assemblies/detectionPoint'

export default {
  ...allPool,
  ...allMedicine,
  ...allDetectionPoint
}
