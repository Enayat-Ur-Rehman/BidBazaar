theory MedicalInfusionPump_WithExample
  imports Complex_Main
begin

(* ================================================================
   Medical Infusion Pump - WITH WORKED EXAMPLE
   This version shows proper proof patterns for one lemma.
   ================================================================ *)

(* ---- SECTIONS 1-8 UNCHANGED ---- *)

definition MAX_FLOW_RATE :: real where "MAX_FLOW_RATE = 500.0"
definition MIN_RESERVOIR  :: real where "MIN_RESERVOIR  = 5.0"
definition BOLUS_MAX      :: real where "BOLUS_MAX      = 50.0"
definition BOLUS_LOCK_MIN :: nat  where "BOLUS_LOCK_MIN = 15"

datatype AlarmLevel = NONE_AL | WARNING_AL | CRITICAL_AL
datatype PumpMode = IDLE_PM | RUNNING_PM | PAUSED_PM | ALARM_PM | EMPTY_PM

type_synonym PatientID = nat
type_synonym PumpID    = nat

definition inv_PatientID :: "nat ⇒ bool" where
  "inv_PatientID n ⟷ n ≥ 1"

definition inv_PumpID :: "nat ⇒ bool" where
  "inv_PumpID n ⟷ n ≥ 1"

definition inv_FlowRate :: "real ⇒ bool" where
  "inv_FlowRate r ⟷ r ≥ 0.0 ∧ r ≤ MAX_FLOW_RATE"

lemma FlowRate_inv_satisfiable : "inv_FlowRate 0.0"
  by (simp add: inv_FlowRate_def MAX_FLOW_RATE_def)

definition inv_Volume :: "real ⇒ bool" where
  "inv_Volume v ⟷ v ≥ 0.0"

lemma Volume_inv_satisfiable : "inv_Volume 0.0"
  by (simp add: inv_Volume_def)

record Patient =
  pat_id   :: PatientID
  pat_name :: "char list"
  pat_dose :: real

record Pump =
  pump_id        :: PumpID
  pump_patient   :: Patient
  pump_mode      :: PumpMode
  pump_flowRate  :: real
  pump_reservoir :: real
  pump_totalAdmin :: real
  pump_alarm     :: AlarmLevel

definition wf_Patient :: "Patient ⇒ bool" where
  "wf_Patient p ⟷
     inv_PatientID (pat_id p) ∧
     inv_Volume    (pat_dose p)"

definition wf_Pump :: "Pump ⇒ bool" where
  "wf_Pump pu ⟷
     inv_PumpID   (pump_id pu) ∧
     wf_Patient   (pump_patient pu) ∧
     inv_FlowRate (pump_flowRate pu) ∧
     inv_Volume   (pump_reservoir pu) ∧
     inv_Volume   (pump_totalAdmin pu)"

definition pdom :: "('a ⇒ 'b option) ⇒ 'a set" where
  "pdom f = {x. f x ≠ None}"

record MedicalInfusionPumpSystem =
  sys_pumps   :: "PumpID ⇒ Pump option"
  sys_alarms  :: "PumpID set"
  sys_bolus   :: "PumpID ⇒ (nat list) option"
  sys_log     :: real

definition inv_System :: "MedicalInfusionPumpSystem ⇒ bool" where
  "inv_System s ⟷
     sys_alarms s ⊆ pdom (sys_pumps s)
   ∧ (∀pid ∈ pdom (sys_pumps s).
         case sys_pumps s pid of
           None    ⇒ False
         | Some pu ⇒ pump_totalAdmin pu ≤ pat_dose (pump_patient pu))
   ∧ (∀pid ∈ pdom (sys_pumps s).
         case sys_pumps s pid of
           None    ⇒ False
         | Some pu ⇒ pump_reservoir pu ≥ 0.0)
   ∧ (∀pid ∈ pdom (sys_pumps s).
         case sys_pumps s pid of
           None    ⇒ False
         | Some pu ⇒ pump_alarm pu = CRITICAL_AL ⟶ pid ∈ sys_alarms s)
   ∧ (∀pid ∈ pdom (sys_pumps s).
         case sys_pumps s pid of
           None    ⇒ False
         | Some pu ⇒ pump_mode pu = RUNNING_PM ⟶ pump_flowRate pu ≤ MAX_FLOW_RATE)
   ∧ sys_log s ≥ 0.0"

definition initState :: MedicalInfusionPumpSystem where
  "initState = ⦇
     sys_pumps  = (λ_. None),
     sys_alarms = {},
     sys_bolus  = (λ_. None),
     sys_log    = 0.0
   ⦈"

lemma initState_satisfies_inv : "inv_System initState"
  by (simp add: inv_System_def initState_def pdom_def)

lemma pdom_empty [simp] : "pdom (λ_. None) = {}"
  by (simp add: pdom_def)

lemma pdom_update [simp] : "pdom (f(k ↦ v)) = pdom f ∪ {k}"
  by (auto simp: pdom_def)

lemma pdom_lookup :
  "pid ∈ pdom f ⟹ ∃v. f pid = Some v"
  by (auto simp: pdom_def)

definition pre_RegisterPump ::
    "MedicalInfusionPumpSystem ⇒ PumpID ⇒ Patient ⇒ real ⇒ bool" where
  "pre_RegisterPump s pid p initVol ⟷
     inv_PumpID pid ∧
     pid ∉ pdom (sys_pumps s) ∧
     initVol > 0.0"

definition pre_SetFlowRate ::
    "MedicalInfusionPumpSystem ⇒ PumpID ⇒ real ⇒ bool" where
  "pre_SetFlowRate s pid rate ⟷
     pid ∈ pdom (sys_pumps s) ∧
     inv_FlowRate rate ∧
     (case sys_pumps s pid of
        None    ⇒ False
      | Some pu ⇒ pump_mode pu ≠ ALARM_PM ∧ pump_mode pu ≠ EMPTY_PM)"

definition pre_AdministerBolus ::
    "MedicalInfusionPumpSystem ⇒ PumpID ⇒ real ⇒ nat ⇒ bool" where
  "pre_AdministerBolus s pid bolusVol currentMin ⟷
     pid ∈ pdom (sys_pumps s) ∧
     inv_Volume bolusVol ∧
     bolusVol ≤ BOLUS_MAX ∧
     (case sys_pumps s pid of
        None    ⇒ False
      | Some pu ⇒
          pump_mode pu = RUNNING_PM ∧
          (pump_totalAdmin pu + bolusVol) ≤ pat_dose (pump_patient pu) ∧
          pump_reservoir pu ≥ bolusVol ∧
          (case sys_bolus s pid of
             None    ⇒ True
           | Some lg ⇒
               lg = [] ∨
               currentMin - last lg ≥ BOLUS_LOCK_MIN))"

definition pre_SystemCheck ::
    "MedicalInfusionPumpSystem ⇒ PumpID ⇒ bool" where
  "pre_SystemCheck s pid ⟷ pid ∈ pdom (sys_pumps s)"

definition pre_AcknowledgeAlarm ::
    "MedicalInfusionPumpSystem ⇒ PumpID ⇒ bool" where
  "pre_AcknowledgeAlarm s pid ⟷
     pid ∈ pdom (sys_pumps s) ∧
     (case sys_pumps s pid of
        None    ⇒ False
      | Some pu ⇒ pump_mode pu = ALARM_PM)"

definition RegisterPump ::
    "MedicalInfusionPumpSystem ⇒ PumpID ⇒ Patient ⇒ real
     ⇒ MedicalInfusionPumpSystem" where
  "RegisterPump s pid p initVol =
     (let newPump = ⦇
            pump_id        = pid,
            pump_patient   = p,
            pump_mode      = IDLE_PM,
            pump_flowRate  = 0.0,
            pump_reservoir = initVol,
            pump_totalAdmin = 0.0,
            pump_alarm     = NONE_AL
          ⦈
      in s⦇ sys_pumps := (sys_pumps s)(pid ↦ newPump) ⦈)"

definition SetFlowRate ::
    "MedicalInfusionPumpSystem ⇒ PumpID ⇒ real
     ⇒ MedicalInfusionPumpSystem" where
  "SetFlowRate s pid rate =
     (case sys_pumps s pid of
        None    ⇒ s
      | Some pu ⇒
          let newPump =
            if rate = 0.0
            then pu⦇ pump_flowRate := 0.0,  pump_mode := PAUSED_PM  ⦈
            else pu⦇ pump_flowRate := rate,  pump_mode := RUNNING_PM ⦈
          in s⦇ sys_pumps := (sys_pumps s)(pid ↦ newPump) ⦈)"

definition AdministerBolus ::
    "MedicalInfusionPumpSystem ⇒ PumpID ⇒ real ⇒ nat
     ⇒ MedicalInfusionPumpSystem" where
  "AdministerBolus s pid bolusVol currentMin =
     (case sys_pumps s pid of
        None    ⇒ s
      | Some pu ⇒
          let newReservoir = pump_reservoir pu - bolusVol;
              newTotal     = pump_totalAdmin pu + bolusVol;
              newAlarm     = (if newReservoir < MIN_RESERVOIR
                              then WARNING_AL
                              else pump_alarm pu);
              prevLog      = (case sys_bolus s pid of
                                None    ⇒ []
                              | Some lg ⇒ lg);
              newLog       = prevLog @ [currentMin];
              newPump      = pu⦇
                               pump_reservoir  := newReservoir,
                               pump_totalAdmin := newTotal,
                               pump_alarm      := newAlarm
                             ⦈
          in s⦇
               sys_pumps := (sys_pumps s)(pid ↦ newPump),
               sys_bolus := (sys_bolus s)(pid ↦ newLog),
               sys_log   := sys_log s + bolusVol
             ⦈)"

definition SystemCheck ::
    "MedicalInfusionPumpSystem ⇒ PumpID
     ⇒ MedicalInfusionPumpSystem" where
  "SystemCheck s pid =
     (case sys_pumps s pid of
        None    ⇒ s
      | Some pu ⇒
          if pump_reservoir pu ≤ 0.0
          then
            let newPump = pu⦇ pump_mode := EMPTY_PM, pump_alarm := CRITICAL_AL ⦈
            in s⦇
                 sys_pumps  := (sys_pumps s)(pid ↦ newPump),
                 sys_alarms := sys_alarms s ∪ {pid}
               ⦈
          else if pump_reservoir pu < MIN_RESERVOIR
          then
            let newPump = pu⦇ pump_alarm := WARNING_AL ⦈
            in s⦇ sys_pumps := (sys_pumps s)(pid ↦ newPump) ⦈
          else if pump_totalAdmin pu ≥ pat_dose (pump_patient pu)
          then
            let newPump = pu⦇ pump_mode := ALARM_PM, pump_alarm := CRITICAL_AL ⦈
            in s⦇
                 sys_pumps  := (sys_pumps s)(pid ↦ newPump),
                 sys_alarms := sys_alarms s ∪ {pid}
               ⦈
          else
            let newPump = pu⦇ pump_alarm := NONE_AL ⦈
            in s⦇ sys_pumps := (sys_pumps s)(pid ↦ newPump) ⦈)"

definition AcknowledgeAlarm ::
    "MedicalInfusionPumpSystem ⇒ PumpID
     ⇒ MedicalInfusionPumpSystem" where
  "AcknowledgeAlarm s pid =
     (case sys_pumps s pid of
        None    ⇒ s
      | Some pu ⇒
          let newPump = pu⦇ pump_mode := PAUSED_PM, pump_alarm := NONE_AL ⦈
          in s⦇
               sys_pumps  := (sys_pumps s)(pid ↦ newPump),
               sys_alarms := sys_alarms s - {pid}
             ⦈)"

(* ================================================================
   Section 9: Postcondition lemmas
   ================================================================ *)

lemma RegisterPump_post :
  assumes "pre_RegisterPump s pid p initVol"
  shows
    "pid ∈ pdom (sys_pumps (RegisterPump s pid p initVol)) ∧
     (case sys_pumps (RegisterPump s pid p initVol) pid of
        None    ⇒ False
      | Some pu ⇒ pump_mode pu = IDLE_PM)"
  by (simp add: RegisterPump_def pdom_def)

lemma SetFlowRate_post :
  assumes pre : "pre_SetFlowRate s pid rate"
  shows
    "case sys_pumps (SetFlowRate s pid rate) pid of
       None    ⇒ False
     | Some pu ⇒ pump_flowRate pu = rate"
proof -
  from pre obtain pu where lu : "sys_pumps s pid = Some pu"
    by (auto simp: pre_SetFlowRate_def pdom_def split: option.splits)
  thus ?thesis by (simp add: SetFlowRate_def lu)
qed

(* ================================================================
   Section 10: WORKED EXAMPLE - Partial invariant proof
   ================================================================ *)

(* This lemma is FULLY PROVEN as an example *)
lemma inv_System_log_simple :
  "inv_System s ⟹ sys_log s ≥ 0.0"
  by (simp add: inv_System_def)

(* This lemma shows invariant decomposition *)
lemma inv_System_parts :
  "inv_System s ⟹
   sys_alarms s ⊆ pdom (sys_pumps s) ∧
   (∀pid ∈ pdom (sys_pumps s).
      case sys_pumps s pid of None ⇒ False
      | Some pu ⇒ pump_totalAdmin pu ≤ pat_dose (pump_patient pu)) ∧
   (∀pid ∈ pdom (sys_pumps s).
      case sys_pumps s pid of None ⇒ False
      | Some pu ⇒ pump_reservoir pu ≥ 0.0) ∧
   (∀pid ∈ pdom (sys_pumps s).
      case sys_pumps s pid of None ⇒ False
      | Some pu ⇒ pump_alarm pu = CRITICAL_AL ⟶ pid ∈ sys_alarms s) ∧
   (∀pid ∈ pdom (sys_pumps s).
      case sys_pumps s pid of None ⇒ False
      | Some pu ⇒ pump_mode pu = RUNNING_PM ⟶ pump_flowRate pu ≤ MAX_FLOW_RATE) ∧
   sys_log s ≥ 0.0"
  by (simp add: inv_System_def)

(* PARTIAL PROOF: First goal only (sys_log preservation) *)
lemma RegisterPump_preserves_log :
  assumes inv  : "inv_System s"
  and     pre  : "pre_RegisterPump s pid p initVol"
  shows "sys_log (RegisterPump s pid p initVol) ≥ 0.0"
proof -
  from inv have "sys_log s ≥ 0.0" by (simp add: inv_System_def)
  thus ?thesis by (simp add: RegisterPump_def)
qed

(* REMAINING PROOFS: Use sorry placeholders *)

lemma RegisterPump_preserves_inv :
  assumes inv  : "inv_System s"
  and     pre  : "pre_RegisterPump s pid p initVol"
  and     wfp  : "wf_Patient p"
  and     dose : "initVol ≤ pat_dose p"
  shows "inv_System (RegisterPump s pid p initVol)"
  sorry

lemma SetFlowRate_preserves_inv :
  assumes inv : "inv_System s"
  and     pre : "pre_SetFlowRate s pid rate"
  shows "inv_System (SetFlowRate s pid rate)"
  sorry

lemma AcknowledgeAlarm_preserves_inv :
  assumes inv : "inv_System s"
  and     pre : "pre_AcknowledgeAlarm s pid"
  shows "inv_System (AcknowledgeAlarm s pid)"
  sorry

end
