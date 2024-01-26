import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

// Create styles
const styles = StyleSheet.create({
  page: { backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  section: {
    fontSize: 7,
  },
})

// Create Document Component
export const BraceletPDF = ({ qrcode }: { qrcode: string }) => (
  <Document>
    <Page size={[270.01, 25.01]} style={styles.page}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold' }}>CESAR OLIVEIRA DOS SANTOS ARAUJO</Text>
          <Text>123.123.123-02</Text>
          <Text>VENDEDOR - CARVALHEIRA</Text>
        </View>
        <View style={{ marginLeft: 20 }}>
          <Image style={{ width: 25, height: 25 }} src={`data:image/png;base64, ${qrcode}`} />
        </View>
      </View>
    </Page>
  </Document>
)
