/**
 * Utility functions for exporting FinTech transaction statements to CSV.
 */

/**
 * Escapes a cell value for standard CSV compatibility (RFC 4180 compliant).
 * Wraps in double quotes if the value contains commas, quotes, or newlines.
 */
function escapeCSVValue(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).trim();
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Converts a list of transaction records into CSV string format.
 * @param {Array<Object>} transactions
 * @returns {string} CSV formatted content
 */
export function convertTransactionsToCSV(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return '';
  }

  const headers = [
    'Transaction ID',
    'Date / Time (UTC)',
    'Type',
    'Asset Name',
    'Symbol',
    'Amount',
    'Execution Price',
    'Amount (USD)',
    'Fee',
    'Status',
    'Tx Hash (Short)',
    'Full Hash / Reference'
  ];

  const rows = transactions.map((tx) => [
    escapeCSVValue(tx.id || ''),
    escapeCSVValue(tx.date || ''),
    escapeCSVValue(tx.type || ''),
    escapeCSVValue(tx.asset || ''),
    escapeCSVValue(tx.symbol || ''),
    escapeCSVValue(tx.amount || ''),
    escapeCSVValue(tx.priceAtExecution || ''),
    escapeCSVValue(tx.amountUSD || ''),
    escapeCSVValue(tx.fee || '$0.00'),
    escapeCSVValue(tx.status || 'Completed'),
    escapeCSVValue(tx.txHash || ''),
    escapeCSVValue(tx.fullTxHash || tx.txHash || '')
  ]);

  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  return csvContent;
}

/**
 * Triggers a secure browser file download of the transactions statement as CSV.
 * @param {Array<Object>} transactions - List of transaction objects
 * @param {string} [filename='aether_statement.csv'] - Target filename for download
 * @returns {boolean} True if download was initiated successfully
 */
export function downloadTransactionsCSV(transactions, filename = 'aether_statement.csv') {
  try {
    const csvData = convertTransactionsToCSV(transactions);
    if (!csvData) {
      console.warn("No transactions available to export.");
      return false;
    }

    // Prepend UTF-8 Byte Order Mark (BOM) so Excel and international spreadsheet viewers parse correctly
    const blob = new Blob(['\uFEFF' + csvData], {
      type: 'text/csv;charset=utf-8;'
    });

    // Create a temporary object URL and link to trigger secure download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Clean up DOM and memory
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    return true;
  } catch (err) {
    console.error("Failed to generate and download CSV statement:", err);
    return false;
  }
}
