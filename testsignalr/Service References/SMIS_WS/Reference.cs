﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace testsignalr.SMIS_WS {
    using System.Data;
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="SMIS_WS.SMIS_WebserviceSoap")]
    public interface SMIS_WebserviceSoap {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/Upd_FlightFieldForGS", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Data.DataTable Upd_FlightFieldForGS(string fieldname, string fieldValue, string flightDateTime, string arrDep, string flightNo, string pass);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/Upd_FlightFieldForGS", ReplyAction="*")]
        System.Threading.Tasks.Task<System.Data.DataTable> Upd_FlightFieldForGSAsync(string fieldname, string fieldValue, string flightDateTime, string arrDep, string flightNo, string pass);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface SMIS_WebserviceSoapChannel : testsignalr.SMIS_WS.SMIS_WebserviceSoap, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class SMIS_WebserviceSoapClient : System.ServiceModel.ClientBase<testsignalr.SMIS_WS.SMIS_WebserviceSoap>, testsignalr.SMIS_WS.SMIS_WebserviceSoap {
        
        public SMIS_WebserviceSoapClient() {
        }
        
        public SMIS_WebserviceSoapClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public SMIS_WebserviceSoapClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public SMIS_WebserviceSoapClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public SMIS_WebserviceSoapClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public System.Data.DataTable Upd_FlightFieldForGS(string fieldname, string fieldValue, string flightDateTime, string arrDep, string flightNo, string pass) {
            return base.Channel.Upd_FlightFieldForGS(fieldname, fieldValue, flightDateTime, arrDep, flightNo, pass);
        }
        
        public System.Threading.Tasks.Task<System.Data.DataTable> Upd_FlightFieldForGSAsync(string fieldname, string fieldValue, string flightDateTime, string arrDep, string flightNo, string pass) {
            return base.Channel.Upd_FlightFieldForGSAsync(fieldname, fieldValue, flightDateTime, arrDep, flightNo, pass);
        }
    }
}
