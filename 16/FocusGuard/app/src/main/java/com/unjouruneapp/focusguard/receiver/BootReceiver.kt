package com.unjouruneapp.focusguard.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.unjouruneapp.focusguard.service.UsageMonitorService

class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == "android.intent.action.QUICKBOOT_POWERON") {

            // Start the monitoring service
            val serviceIntent = Intent(context, UsageMonitorService::class.java).apply {
                action = UsageMonitorService.ACTION_START
            }
            context.startForegroundService(serviceIntent)
        }
    }
}
