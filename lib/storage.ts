// Utilidades para almacenamiento local

export interface AppConfig {
  afip: {
    cuit: string
    certPath: string
    keyPath: string
    environment: 'testing' | 'production'
    pointOfSale: string
  }
  whatsapp: {
    number: string
    messageTemplate: string
  }
}

export interface Client {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  createdAt: string
}

export interface PendingInvoice {
  id: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
  total: number
  clientId?: string
  clientName?: string
  clientPhone?: string
  createdAt: string
  status: 'pending' | 'invoiced'
}

const CONFIG_KEY = 'app-config'
const CLIENTS_KEY = 'app-clients'
const PENDING_INVOICES_KEY = 'app-pending-invoices'

// Configuración
export function getConfig(): AppConfig | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(CONFIG_KEY)
  return stored ? JSON.parse(stored) : null
}

export function saveConfig(config: AppConfig): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export function getDefaultConfig(): AppConfig {
  return {
    afip: {
      cuit: '',
      certPath: '',
      keyPath: '',
      environment: 'testing',
      pointOfSale: '1',
    },
    whatsapp: {
      number: '',
      messageTemplate: 'Hola! Tu factura está lista. Total: {total}',
    },
  }
}

// Clientes
export function getClients(): Client[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(CLIENTS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveClient(client: Client): void {
  if (typeof window === 'undefined') return
  const clients = getClients()
  const existingIndex = clients.findIndex((c) => c.id === client.id)
  if (existingIndex >= 0) {
    clients[existingIndex] = client
  } else {
    clients.push(client)
  }
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients))
}

export function createClient(name: string, phone: string, email?: string, address?: string): Client {
  const client: Client = {
    id: `client-${Date.now()}`,
    name,
    phone,
    email,
    address,
    createdAt: new Date().toISOString(),
  }
  saveClient(client)
  return client
}

export function getClientById(id: string): Client | null {
  const clients = getClients()
  return clients.find((c) => c.id === id) || null
}

export function searchClients(query: string): Client[] {
  const clients = getClients()
  const lowerQuery = query.toLowerCase()
  return clients.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.phone.includes(query)
  )
}

// Facturas Pendientes
export function getPendingInvoices(): PendingInvoice[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(PENDING_INVOICES_KEY)
  return stored ? JSON.parse(stored) : []
}

export function savePendingInvoice(invoice: PendingInvoice): void {
  if (typeof window === 'undefined') return
  const invoices = getPendingInvoices()
  const existingIndex = invoices.findIndex((inv) => inv.id === invoice.id)
  if (existingIndex >= 0) {
    invoices[existingIndex] = invoice
  } else {
    invoices.push(invoice)
  }
  localStorage.setItem(PENDING_INVOICES_KEY, JSON.stringify(invoices))
}

export function createPendingInvoice(
  items: PendingInvoice['items'],
  total: number,
  clientId?: string,
  clientName?: string,
  clientPhone?: string
): PendingInvoice {
  const invoice: PendingInvoice = {
    id: `invoice-${Date.now()}`,
    items,
    total,
    clientId,
    clientName,
    clientPhone,
    createdAt: new Date().toISOString(),
    status: 'pending',
  }
  savePendingInvoice(invoice)
  return invoice
}

export function markInvoiceAsInvoiced(id: string): void {
  const invoices = getPendingInvoices()
  const invoice = invoices.find((inv) => inv.id === id)
  if (invoice) {
    invoice.status = 'invoiced'
    savePendingInvoice(invoice)
  }
}

export function updatePendingInvoice(id: string, updates: Partial<PendingInvoice>): void {
  const invoices = getPendingInvoices()
  const invoice = invoices.find((inv) => inv.id === id)
  if (invoice) {
    Object.assign(invoice, updates)
    savePendingInvoice(invoice)
  }
}

export function deletePendingInvoice(id: string): void {
  if (typeof window === 'undefined') return
  const invoices = getPendingInvoices()
  const filtered = invoices.filter((inv) => inv.id !== id)
  localStorage.setItem(PENDING_INVOICES_KEY, JSON.stringify(filtered))
}
