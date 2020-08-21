package com.example.cotrace.ui.hotspot;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class HotspotViewModel extends ViewModel {

    private MutableLiveData<String> mText;

    public HotspotViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is Hotspot fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}