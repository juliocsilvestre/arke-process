import { Worker } from '@/pages/Workers.defs'
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

// Create styles
const styles = StyleSheet.create({
  page: { backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
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
        }}
      >
        <View style={{ marginLeft: 20 }}>
          <Image style={{ width: 69, height: 69 }} src={`data:image/png;base64, ${qrcode}`} />
        </View>
        <View style={styles.section}>
          <Text style={{ fontFamily: 'Helvetica', fontWeight: 'black', marginTop: 10 }}>
            {worker.full_name.toUpperCase()}
          </Text>
          <Text style={{ fontSize: 14 }}>
            {worker.role} - {worker.company?.name}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
)
