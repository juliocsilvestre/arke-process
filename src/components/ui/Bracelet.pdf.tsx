import { Worker } from '@/pages/Workers.defs'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import LadeiraLogo from '../../assets/ladeira.png'
import staff from '../../assets/staff.png'

// Create styles
const styles = StyleSheet.create({
  page: { backgroundColor: 'transparent', display: 'flex', alignItems: 'flex-start', paddingLeft: 30 },
  section: {
    fontSize: 18,
    marginTop: 5,
  },
})

// Create Document Component
export const BraceletPDF = ({ qrcode, worker }: { qrcode: string; worker: Worker }) => (
  <Document>
    <Page size={[765.35, 70.86]} style={styles.page}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ width: 69 }} src={staff} />
          {/* <Image style={{ width: 100, marginLeft: 10 }} src={LadeiraLogo} /> */}
        </View>
        <View style={{ marginLeft: 20 }}>
          <Image style={{ width: 69, height: 69 }} src={`data:image/png;base64, ${qrcode}`} />
        </View>
        <View style={styles.section}>
          <Text style={{ fontFamily: 'Helvetica', fontWeight: 'black', marginTop: 5 }}>
            {worker.full_name.toUpperCase()}
          </Text>
          <Text style={{ fontSize: 14 }}>{worker.role}</Text>
          <Text style={{ fontSize: 14 }}>{worker.company?.name}</Text>
        </View>
        <View style={{ marginLeft: 20 }}>{/* <Image style={{ width: 100 }} src={LadeiraLogo} /> */}</View>
      </View>
    </Page>
  </Document>
)
