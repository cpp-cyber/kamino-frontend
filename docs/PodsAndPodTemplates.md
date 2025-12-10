# Pods and Pod Templates

## Terminology
List of common terms that will be used throughout this guide.
- **Pod**: Virtual machine environment that is cloned and users have hands on access to.
- **Pod Template**: Baseline configuration for a pod stored both on Proxmox and Kamino.
- **Template Pool**: Where pod templates are stored and configured on Proxmox.
- **Virtual Machine Template**: Pre-installed virtual machine from an ISO image that is then turned into a template to be easily cloned and edited.

## Workflow
These are the steps to create, configure, and publish your own Pod Template in Kamino.
1. **Create Template Pool**: Use the Create Template wizard to create your new template pool in Proxmox.
2. **Configure Template Pool**: Make any configurations or additions to the virtual machines in the template pool.
3. **Publish Pod Template**: Publish a new Pod Template in Kamino by using the Publish Template wizard.
4. **Clone Pod Template**: Clone the Pod Template to create a new Pod.

<br>

### **1. Create Template Pool**
This is where you will follow the steps outlined in the **Create Template** wizard to create your new template pool in Proxmox.

#### 1.1 Template Name
Define a unique name for your template pool. EX: *CIS4670_01_Lab1*

#### 1.2 Router Option
Select whether to automatically create and configure a router for your template pool. 
- If **Yes**, all of the VMs will be connected to the router with 1:1 NATing. 
- If **No**, you will need to manually configure networking for each VM.

#### 1.3 Select VMs
Select virtual machines from a list of pre-installed virtual machine templates in Proxmox to be automatically added to your template pool.

#### 1.4 Review
Review your template pool configuration and make any necessary changes including naming the virtual machines.

<br>

### **2. Configure Template Pool**
Make any configurations or additions to the virtual machines in the template pool in Proxmox.

#### 2.1 Select Template Pool
Select the template pool you created in the previous step.

#### 2.2 Configure VMs
Configure or create virtual machines in the template pool as needed.

<br>

### **3. Publish Pod Template**
Publish a new Pod Template in Kamino by using the Publish Template wizard.

#### 3.1 Select Template Pool
Select the template pool from the dropdown menu that you created in the first step.

#### 3.2 Configure Details
Add a description, list of authors, number of VMs, and an image to your template. Note: The description is the only required field.

#### 3.3 Review
Review your personalization settings with a preview of the template in the Kamino interface in addition to determining the visibility of the template.

- **Visible**: Template is able to be cloned by any user using Kamino.
- **Hidden**: Template is only visible and able to be cloned by Administrators.

<br>

### **4. Clone Pod Template**
Templates can be cloned in two main ways.

#### 4.1 User Clone
General users will login to Kamino and see all visible templates. They can clone these templates to create their own Pod to interact with.

#### 4.2 Administrator Clone
Administrators can clone templates from the Kamino interface. They can clone any amount of pods on behalf of other users or groups.
