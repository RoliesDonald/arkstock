// src/store/slices/estimationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Estimation,
  EstimationFormValues,
  EstimationStatus,
  EstimationItem,
  EstimationService,
  RawEstimationApiResponse, // Import Raw API interfaces
  RawEstimationItemApiResponse,
  RawEstimationServiceApiResponse,
} from "@/types/estimation";
import {
  PartVariant,
  SparePart,
  RawSparePartApiResponse,
} from "@/types/sparepart"; // Import RawSparePartApiResponse
import {
  Service,
  RawServiceApiResponse,
  RequiredSparePart,
  RawRequiredSparePartApiResponse,
} from "@/types/services"; // Import RawServiceApiResponse and RequiredSparePart types
import {
  Vehicle,
  VehicleCategory,
  VehicleFuelType,
  VehicleStatus,
  VehicleTransmissionType,
  VehicleType,
  RawVehicleApiResponse, // Import RawVehicleApiResponse
} from "@/types/vehicle";
import {
  Company,
  CompanyType,
  CompanyStatus,
  RawCompanyApiResponse,
} from "@/types/companies"; // Import RawCompanyApiResponse
import {
  Employee,
  EmployeeRole,
  EmployeeStatus,
  RawEmployeeApiResponse,
} from "@/types/employee"; // Import RawEmployeeApiResponse
import { WorkOrder, RawWorkOrderApiResponse } from "@/types/workOrder"; // Import RawWorkOrderApiResponse
import {
  Invoice,
  InvoiceItem,
  InvoiceService,
  RawInvoiceApiResponse,
  RawInvoiceItemApiResponse,
  RawInvoiceServiceApiResponse,
} from "@/types/invoice"; // Import RawInvoiceApiResponse and its nested raw types
import { api } from "@/lib/utils/api"; // Menggunakan API yang sudah ada

// --- Helper Functions untuk Konversi Tanggal (Date -> String ISO) ---
// Fungsi-fungsi ini akan mengonversi Date objek dari API menjadi string ISO untuk Redux state.

// Fungsi helper untuk memformat tanggal di objek Company
const formatCompanyDates = (rawCompany: RawCompanyApiResponse): Company => {
  return {
    ...rawCompany,
    createdAt: rawCompany.createdAt.toISOString(),
    updatedAt: rawCompany.updatedAt.toISOString(),
  };
};

// Fungsi helper untuk memformat tanggal di objek Employee
const formatEmployeeDates = (rawEmployee: RawEmployeeApiResponse): Employee => {
  return {
    ...rawEmployee,
    createdAt: rawEmployee.createdAt.toISOString(),
    updatedAt: rawEmployee.updatedAt.toISOString(),
    tanggalLahir: rawEmployee.tanggalLahir
      ? rawEmployee.tanggalLahir.toISOString()
      : null,
    tanggalBergabung: rawEmployee.tanggalBergabung
      ? rawEmployee.tanggalBergabung.toISOString()
      : null,
    company: rawEmployee.company
      ? formatCompanyDates(rawEmployee.company)
      : null, // Rekursif
  };
};

// Fungsi helper untuk memformat tanggal di objek SparePart
const formatSparePartDates = (
  rawSparePart: RawSparePartApiResponse
): SparePart => {
  return {
    ...rawSparePart,
    createdAt: rawSparePart.createdAt.toISOString(),
    updatedAt: rawSparePart.updatedAt.toISOString(),
  };
};

// Fungsi helper untuk memformat tanggal di objek WorkOrder
const formatWorkOrderDates = (
  rawWorkOrder: RawWorkOrderApiResponse
): WorkOrder => {
  return {
    ...rawWorkOrder,
    createdAt: rawWorkOrder.createdAt.toISOString(),
    updatedAt: rawWorkOrder.updatedAt.toISOString(),
    date: rawWorkOrder.date.toISOString(),
    schedule: rawWorkOrder.schedule
      ? rawWorkOrder.schedule.toISOString()
      : null,
    vehicle: rawWorkOrder.vehicle
      ? formatVehicleDates(rawWorkOrder.vehicle)
      : undefined, // Rekursif
    customer: rawWorkOrder.customer
      ? formatCompanyDates(rawWorkOrder.customer)
      : undefined, // Rekursif
    carUser: rawWorkOrder.carUser
      ? formatCompanyDates(rawWorkOrder.carUser)
      : undefined, // Rekursif
    vendor: rawWorkOrder.vendor
      ? formatCompanyDates(rawWorkOrder.vendor)
      : undefined, // Rekursif
    mechanic: rawWorkOrder.mechanic
      ? formatEmployeeDates(rawWorkOrder.mechanic)
      : undefined, // Rekursif
    driver: rawWorkOrder.driver
      ? formatEmployeeDates(rawWorkOrder.driver)
      : undefined, // Rekursif
    approvedBy: rawWorkOrder.approvedBy
      ? formatEmployeeDates(rawWorkOrder.approvedBy)
      : undefined, // Rekursif
    requestedBy: rawWorkOrder.requestedBy
      ? formatEmployeeDates(rawWorkOrder.requestedBy)
      : undefined, // Rekursif
    // location: rawWorkOrder.location ? formatLocationDates(rawWorkOrder.location) : undefined, // Jika ada Location
  };
};

// Fungsi helper untuk memformat tanggal di objek InvoiceItem
const formatInvoiceItemDates = (
  rawItem: RawInvoiceItemApiResponse
): InvoiceItem => {
  return {
    ...rawItem,
    createdAt: rawItem.createdAt.toISOString(),
    updatedAt: rawItem.updatedAt.toISOString(),
    sparePart: rawItem.sparePart
      ? formatSparePartDates(rawItem.sparePart)
      : undefined,
  };
};

// Fungsi helper untuk memformat tanggal di objek InvoiceService
const formatInvoiceServiceDates = (
  rawService: RawInvoiceServiceApiResponse
): InvoiceService => {
  return {
    ...rawService,
    createdAt: rawService.createdAt.toISOString(),
    updatedAt: rawService.updatedAt.toISOString(),
    service: rawService.service
      ? formatServiceDates(rawService.service)
      : undefined,
  };
};

// Fungsi helper untuk memformat tanggal di objek Invoice
const formatInvoiceDates = (rawInvoice: RawInvoiceApiResponse): Invoice => {
  return {
    ...rawInvoice,
    createdAt: rawInvoice.createdAt.toISOString(),
    updatedAt: rawInvoice.updatedAt.toISOString(),
    invoiceDate: rawInvoice.invoiceDate.toISOString(),
    finishedDate: rawInvoice.finishedDate.toISOString(),
    // Format nested items and services
    invoiceItems: rawInvoice.invoiceItems?.map(formatInvoiceItemDates) || [],
    invoiceServices:
      rawInvoice.invoiceServices?.map(formatInvoiceServiceDates) || [],
    workOrder: rawInvoice.workOrder
      ? formatWorkOrderDates(rawInvoice.workOrder)
      : undefined,
    vehicle: rawInvoice.vehicle
      ? formatVehicleDates(rawInvoice.vehicle)
      : undefined,
    accountant: rawInvoice.accountant
      ? formatEmployeeDates(rawInvoice.accountant)
      : undefined,
    approvedBy: rawInvoice.approvedBy
      ? formatEmployeeDates(rawInvoice.approvedBy)
      : undefined,
  };
};

// Fungsi helper untuk memformat tanggal di objek Vehicle
const formatVehicleDates = (rawVehicle: RawVehicleApiResponse): Vehicle => {
  return {
    ...rawVehicle,
    createdAt: rawVehicle.createdAt.toISOString(),
    updatedAt: rawVehicle.updatedAt.toISOString(),
    lastServiceDate: rawVehicle.lastServiceDate.toISOString(),
    owner: rawVehicle.owner ? formatCompanyDates(rawVehicle.owner) : undefined, // Rekursif
    carUser: rawVehicle.carUser
      ? formatCompanyDates(rawVehicle.carUser)
      : undefined, // Rekursif
    // Recursively format nested arrays
    workOrders: rawVehicle.workOrders?.map(formatWorkOrderDates) || [], // <-- REKURSIF
    invoices: rawVehicle.invoices?.map(formatInvoiceDates) || [], // <-- REKURSIF
    estimation: rawVehicle.estimation?.map(formatEstimationDates) || [], // <-- REKURSIF
  };
};

// Fungsi helper untuk memformat tanggal di objek EstimationItem
const formatEstimationItemDates = (
  rawItem: RawEstimationItemApiResponse
): EstimationItem => {
  return {
    ...rawItem,
    createdAt: rawItem.createdAt.toISOString(),
    updatedAt: rawItem.updatedAt.toISOString(),
    sparePart: rawItem.sparePart
      ? formatSparePartDates(rawItem.sparePart)
      : undefined, // Rekursif
  };
};

// Fungsi helper untuk memformat tanggal di objek EstimationService
const formatEstimationServiceDates = (
  rawService: RawEstimationServiceApiResponse
): EstimationService => {
  return {
    ...rawService,
    createdAt: rawService.createdAt.toISOString(),
    updatedAt: rawService.updatedAt.toISOString(),
    // Pastikan objek service yang dikembalikan sesuai dengan tipe Service
    service: rawService.service
      ? formatServiceDates(rawService.service) // <-- Panggil formatServiceDates
      : undefined, // Rekursif
  };
};

// Fungsi helper utama untuk memformat tanggal di objek Estimation
const formatEstimationDates = (
  rawEstimation: RawEstimationApiResponse
): Estimation => {
  return {
    ...rawEstimation,
    createdAt: rawEstimation.createdAt.toISOString(),
    updatedAt: rawEstimation.updatedAt.toISOString(),
    estimationDate: rawEstimation.estimationDate.toISOString(),
    finishedDate: rawEstimation.finishedDate
      ? rawEstimation.finishedDate.toISOString()
      : null,

    // Format relasi bersarang
    estimationItems:
      rawEstimation.estimationItems?.map(formatEstimationItemDates) || [],
    estimationServices:
      rawEstimation.estimationServices?.map(formatEstimationServiceDates) || [],

    vehicle: rawEstimation.vehicle
      ? formatVehicleDates(rawEstimation.vehicle)
      : undefined,
    customer: rawEstimation.customer
      ? formatCompanyDates(rawEstimation.customer)
      : undefined,
    mechanic: rawEstimation.mechanic
      ? formatEmployeeDates(rawEstimation.mechanic)
      : undefined,
    approvedBy: rawEstimation.approvedBy
      ? formatEmployeeDates(rawEstimation.approvedBy)
      : undefined,
    accountant: rawEstimation.accountant
      ? formatEmployeeDates(rawEstimation.accountant)
      : undefined,
    workOrder: rawEstimation.workOrder
      ? formatWorkOrderDates(rawEstimation.workOrder)
      : undefined,
  };
};

// Fungsi helper untuk memformat tanggal di objek Service
// Fungsi ini harus didefinisikan setelah semua helper yang mungkin dipanggilnya (seperti formatSparePartDates)
// atau dideklarasikan sebagai 'function' agar hoisting bekerja.
// Saya akan memindahkannya di sini untuk memastikan semua dependensi ada.
// Ini adalah fungsi yang menyebabkan error karena invoiceServices dan estimationServices tidak diformat.
const formatServiceDates = (rawService: RawServiceApiResponse): Service => {
  return {
    ...rawService,
    createdAt: rawService.createdAt.toISOString(),
    updatedAt: rawService.updatedAt.toISOString(),
    requiredSpareParts:
      rawService.requiredSpareParts?.map(
        (rsp: RawRequiredSparePartApiResponse) => ({
          ...rsp,
          sparePart: rsp.sparePart
            ? formatSparePartDates(rsp.sparePart)
            : undefined,
        })
      ) || [],
    // PERBAIKAN: Format invoiceServices dan estimationServices
    invoiceServices:
      rawService.invoiceServices?.map(formatInvoiceServiceDates) || [],
    estimationServices:
      rawService.estimationServices?.map(formatEstimationServiceDates) || [],
  };
};

// --- Initial State ---
interface EstimateState {
  estimates: Estimation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EstimateState = {
  estimates: [], // Dimulai dengan array kosong, tidak ada data dummy
  status: "idle",
  error: null,
};

// --- Async Thunks (Menggunakan API Anda) ---
export const fetchEstimates = createAsyncThunk(
  "estimates/fetchEstimates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<RawEstimationApiResponse[]>(
        "http://localhost:3000/api/estimations"
      ); // Ganti dengan endpoint API Anda
      const formattedData = response.map(formatEstimationDates);
      return formattedData;
    } catch (error: any) {
      console.error("Error fetching estimations:", error);
      return rejectWithValue(error.message || "Gagal memuat estimasi.");
    }
  }
);

export const addEstimate = createAsyncThunk(
  "estimates/addEstimate",
  async (newEstimateData: EstimationFormValues, { rejectWithValue }) => {
    try {
      // API Anda mungkin mengharapkan tanggal sebagai string ISO, atau objek Date.
      // Jika formSchema menggunakan z.date(), newEstimateData.estimationDate adalah Date objek.
      // Sesuaikan payload jika API Anda membutuhkan format string ISO:
      const payload = {
        ...newEstimateData,
        estimationDate: newEstimateData.estimationDate.toISOString(),
        // Jika ada finishedDate dari form:
        finishedDate: newEstimateData.finishedDate
          ? newEstimateData.finishedDate.toISOString()
          : null,
      };

      const response = await api.post<RawEstimationApiResponse>(
        "http://localhost:3000/api/estimations", // Ganti dengan endpoint API Anda
        payload
      );
      return formatEstimationDates(response);
    } catch (error: any) {
      console.error("Error adding estimation:", error);
      return rejectWithValue(error.message || "Gagal membuat estimasi baru.");
    }
  }
);

export const updateEstimate = createAsyncThunk(
  "estimates/updateEstimate",
  async (
    updatedEstimateData: EstimationFormValues, // Menggunakan EstimationFormValues untuk konsistensi input
    { rejectWithValue }
  ) => {
    try {
      if (!updatedEstimateData.id) {
        throw new Error("ID estimasi tidak ditemukan untuk pembaruan.");
      }

      // Sesuaikan payload jika API Anda membutuhkan format string ISO:
      const payload = {
        ...updatedEstimateData,
        estimationDate: updatedEstimateData.estimationDate.toISOString(),
        finishedDate: updatedEstimateData.finishedDate
          ? updatedEstimateData.finishedDate.toISOString()
          : null,
      };

      const response = await api.put<RawEstimationApiResponse>(
        `http://localhost:3000/api/estimations/${updatedEstimateData.id}`, // Ganti dengan endpoint API Anda
        payload
      );
      return formatEstimationDates(response);
    } catch (error: any) {
      console.error("Error updating estimation:", error);
      return rejectWithValue(error.message || "Gagal memperbarui estimasi.");
    }
  }
);

export const deleteEstimate = createAsyncThunk(
  "estimates/deleteEstimate",
  async (estimateId: string, { rejectWithValue }) => {
    try {
      await api.delete(`http://localhost:3000/api/estimations/${estimateId}`); // Ganti dengan endpoint API Anda
      return estimateId;
    } catch (error: any) {
      console.error("Error deleting estimation:", error);
      return rejectWithValue(error.message || "Gagal menghapus estimasi.");
    }
  }
);

const estimateSlice = createSlice({
  name: "estimates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstimates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchEstimates.fulfilled,
        (state, action: PayloadAction<Estimation[]>) => {
          state.status = "succeeded";
          state.estimates = action.payload;
        }
      )
      .addCase(fetchEstimates.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Gagal memuat estimasi";
      })
      .addCase(
        addEstimate.fulfilled,
        (state, action: PayloadAction<Estimation>) => {
          state.estimates.push(action.payload);
        }
      )
      .addCase(
        updateEstimate.fulfilled,
        (state, action: PayloadAction<Estimation>) => {
          const index = state.estimates.findIndex(
            (estimate) => estimate.id === action.payload.id
          );
          if (index !== -1) {
            state.estimates[index] = action.payload;
          }
        }
      )
      .addCase(
        deleteEstimate.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.estimates = state.estimates.filter(
            (estimate) => estimate.id !== action.payload
          );
        }
      );
  },
});

export default estimateSlice.reducer;
